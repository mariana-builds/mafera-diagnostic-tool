export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { saveLead, LeadRecord } from "@/lib/db";
import { Resend } from "resend";
import {
  getCurrentSituation,
  getTargetState,
  getPipelineCount,
  getAutomationsScope,
  getMigrationScope,
  getIntegrationsScope,
  getTimeline,
  getAutomationCurrentSituation,
  getAutomationTarget,
  getAutomationTimeline,
  quoteRange,
} from "@/lib/scope";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FROM = process.env.FROM_EMAIL ?? "mariana@mafera.de";
  const CONSULTANT = process.env.CONSULTANT_EMAIL ?? "mariana@mafera.de";
  const CAL_30 =
    process.env.NEXT_PUBLIC_CALENDAR_30MIN ??
    "https://calendar.notion.so/meet/mariana-ferreira/schedule";

  try {
    const body = await req.json();

    // ── Build lead record ──────────────────────────────────────────────────
    const answers: Record<number, string> = body.answers ?? {};
    const scores: Record<number, number> = body.scores ?? {};
    const flow: "regular" | "automation" = body.flow;
    const q1Choice: string = body.q1Choice ?? answers[1] ?? "";

    let scoresList: number[] = [];
    let totalScore: number | null = null;
    let complexity: string | null = null;
    let quoteLow: number = body.quoteLow;
    let quoteHigh: number = body.quoteHigh;
    let daysLow: number = body.daysLow;
    let daysHigh: number = body.daysHigh;
    let currentSituation: string;
    let targetState: string;

    if (flow === "regular") {
      for (let q = 2; q <= 11; q++) {
        scoresList.push(scores[q] ?? 0);
      }
      totalScore = scoresList.reduce((a, b) => a + b, 0);
      complexity = body.complexity;
      currentSituation = getCurrentSituation(answers);
      targetState = getTargetState(answers);
    } else {
      const q12 = answers[12] ?? body.q12Choice ?? "";
      currentSituation = getAutomationCurrentSituation(q12);
      targetState = getAutomationTarget(q12);
    }

    const lead: LeadRecord = {
      flowType: flow,
      q1Choice,
      scores: scoresList,
      totalScore,
      complexity,
      quoteLow,
      quoteHigh,
      daysLow,
      daysHigh,
      currentSituation,
      targetState,
      name: body.name,
      email: body.email,
      company: body.company,
      context: body.context ?? "",
    };

    // ── Save to DB ─────────────────────────────────────────────────────────
    let leadId: number | null = null;
    try {
      leadId = await saveLead(lead);
    } catch (dbErr) {
      console.error("DB save error:", dbErr);
      // Don't block the response — still send emails
    }

    // ── Build email HTML ───────────────────────────────────────────────────
    const qRange = quoteRange(quoteLow, quoteHigh);
    const days = `${daysLow}–${daysHigh} days`;

    const scopeHtml =
      flow === "regular"
        ? buildRegularScopeHtml(answers, scores, body, currentSituation, targetState, qRange, days)
        : buildAutomationScopeHtml(answers[12] ?? body.q12Choice ?? "", currentSituation, targetState, qRange, days);

    const leadEmailHtml = buildLeadEmail(body.name, scopeHtml);
    const notifHtml = buildNotifEmail(lead, scopeHtml);

    // ── Send emails ────────────────────────────────────────────────────────
    const emailErrors: string[] = [];

    try {
      await resend.emails.send({
        from: FROM,
        to: body.email,
        reply_to: CONSULTANT,
        subject: "Your new sales setup: Your project scope and quote by Mafera",
        html: leadEmailHtml,
      });
    } catch (e) {
      console.error("Lead email error:", e);
      emailErrors.push("lead");
    }

    try {
      await resend.emails.send({
        from: FROM,
        to: CONSULTANT,
        subject: `New lead: ${body.name} · ${body.company} · ${qRange}`,
        html: notifHtml,
      });
    } catch (e) {
      console.error("Notif email error:", e);
      emailErrors.push("notification");
    }

    return NextResponse.json({
      success: true,
      leadId,
      emailErrors: emailErrors.length ? emailErrors : undefined,
    });
  } catch (err) {
    console.error("submit-lead error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── HTML builders ─────────────────────────────────────────────────────────

function buildRegularScopeHtml(
  answers: Record<number, string>,
  scores: Record<number, number>,
  body: Record<string, unknown>,
  currentSituation: string,
  targetState: string,
  qRange: string,
  days: string
): string {
  const complexity = body.complexity as string;
  const timeline = getTimeline(complexity as "Low" | "Medium" | "High");
  const pipelineCount = getPipelineCount(answers);
  const automationsScope = getAutomationsScope(answers);
  const migrationScope = getMigrationScope(answers);
  const integrationsScope = getIntegrationsScope(answers);

  return `
    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">Current Situation</h2>
    <p style="color:#475569;margin:0 0 16px">${currentSituation}</p>

    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">Target State</h2>
    <p style="color:#475569;margin:0 0 16px">${targetState}</p>

    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">What's In Scope</h2>
    <ul style="color:#475569;padding-left:20px;margin:0 0 16px">
      <li>CRM setup + ${pipelineCount}</li>
      <li>${migrationScope}</li>
      <li>${automationsScope}</li>
      <li>${integrationsScope}</li>
      <li>Custom dashboards + KPI reporting</li>
      <li>Team enablement + 2 weeks post-go-live support</li>
    </ul>

    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">What's Not In Scope</h2>
    <ul style="color:#475569;padding-left:20px;margin:0 0 16px">
      <li>Ongoing managed services</li>
      <li>Custom development beyond CRM configuration</li>
      <li>Marketing automation build (integration only)</li>
      <li>Additional user training beyond handover sessions</li>
    </ul>

    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">Key Deliverables</h2>
    <ul style="color:#475569;padding-left:20px;margin:0 0 16px">
      <li>Fully configured CRM + pipelines</li>
      <li>${automationsScope} live + documented</li>
      <li>Custom dashboards + KPI tracking setup</li>
      <li>Playbooks for each team</li>
      <li>2 weeks post-go-live support</li>
    </ul>

    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">Timeline: ${days}</h2>
    <ul style="color:#475569;padding-left:20px;margin:0 0 16px">
      ${timeline.map((t) => `<li>${t}</li>`).join("")}
    </ul>

    <div style="background:#f1f5f9;border-radius:8px;padding:20px;margin:24px 0">
      <p style="margin:0 0 4px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.05em">Complexity</p>
      <p style="margin:0 0 16px;color:#1e293b;font-weight:700;font-size:18px">${complexity}</p>
      <p style="margin:0 0 4px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.05em">Quote</p>
      <p style="margin:0 0 16px;color:#1e293b;font-weight:700;font-size:24px">${qRange}</p>
      <p style="margin:0;color:#64748b;font-size:14px">Commercial terms: 40% upfront · 30% mid-project · 30% on delivery</p>
    </div>
  `;
}

function buildAutomationScopeHtml(
  q12Choice: string,
  currentSituation: string,
  targetState: string,
  qRange: string,
  days: string
): string {
  const timeline = getAutomationTimeline(q12Choice);
  return `
    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">Current Situation</h2>
    <p style="color:#475569;margin:0 0 16px">${currentSituation}</p>

    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">Target State</h2>
    <p style="color:#475569;margin:0 0 16px">${targetState}</p>

    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">What's In Scope</h2>
    <ul style="color:#475569;padding-left:20px;margin:0 0 16px">
      <li>Audit of existing automations</li>
      <li>Build ${targetState.toLowerCase().replace(" live", "")}</li>
      <li>Testing + team handover documentation</li>
    </ul>

    <h2 style="color:#1e293b;font-size:20px;margin:24px 0 8px">What's Not In Scope</h2>
    <ul style="color:#475569;padding-left:20px;margin:0 0 16px">
      <li>CRM rebuild or data migration</li>
      <li>New integrations with external tools</li>
      <li>Dashboard or reporting build</li>
    </ul>

    <div style="background:#f1f5f9;border-radius:8px;padding:20px;margin:24px 0">
      <p style="margin:0 0 4px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.05em">Timeline</p>
      <p style="margin:0 0 16px;color:#1e293b;font-weight:700;font-size:18px">${timeline}</p>
      <p style="margin:0 0 4px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.05em">Quote</p>
      <p style="margin:0 0 16px;color:#1e293b;font-weight:700;font-size:24px">${qRange}</p>
      <p style="margin:0;color:#64748b;font-size:14px">Commercial terms: 40% upfront · 60% on delivery</p>
    </div>
  `;
}

function buildLeadEmail(name: string, scopeHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
    <div style="background:#FF6B35;padding:32px 40px">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700">Your new sales setup: Your project scope and quote</h1>
    </div>
    <div style="padding:32px 40px">
      <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">Hi ${name},<br><br>
        Below is a rough scope and quote for your sales pipeline improvement project. Reply to this email or book a kickoff call below when you're ready to move forward.
      </p>
      ${scopeHtml}
      <div style="margin:32px 0 0;padding:24px;background:#fff4ef;border-radius:8px;text-align:center">
        <p style="margin:0 0 16px;color:#1e293b;font-weight:600;font-size:16px">Ready to get started?</p>
        <a href="${CAL_30}" style="display:inline-block;background:#FF6B35;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px">Book your 30-min kickoff call</a>
        <p style="margin:16px 0 0;color:#64748b;font-size:13px">Or reply to this email · <a href="mailto:mariana@mafera.de" style="color:#FF6B35">mariana@mafera.de</a></p>
      </div>
    </div>
    <div style="padding:24px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center">
      <p style="margin:0;color:#94a3b8;font-size:12px">Pipeline Diagnostic · mafera.de · <a href="mailto:mariana@mafera.de" style="color:#94a3b8">mariana@mafera.de</a></p>
    </div>
  </div>
</body>
</html>`;
}

function buildNotifEmail(lead: LeadRecord, scopeHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:0">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;padding:32px 40px;box-shadow:0 1px 3px rgba(0,0,0,.1)">
    <h1 style="color:#1e293b;font-size:22px;margin:0 0 24px">New lead submitted</h1>
    <table style="width:100%;border-collapse:collapse;margin:0 0 24px">
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0;width:140px">Name</td><td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;border-bottom:1px solid #e2e8f0">${lead.name}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0">Email</td><td style="padding:8px 0;color:#1e293b;font-size:14px;border-bottom:1px solid #e2e8f0">${lead.email}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0">Company</td><td style="padding:8px 0;color:#1e293b;font-size:14px;border-bottom:1px solid #e2e8f0">${lead.company}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0">Flow</td><td style="padding:8px 0;color:#1e293b;font-size:14px;border-bottom:1px solid #e2e8f0">${lead.flowType} (Q1=${lead.q1Choice})</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0">Quote</td><td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:700;border-bottom:1px solid #e2e8f0">€${lead.quoteLow.toLocaleString("de-DE")}–€${lead.quoteHigh.toLocaleString("de-DE")}</td></tr>
      ${lead.complexity ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0">Complexity</td><td style="padding:8px 0;color:#1e293b;font-size:14px;border-bottom:1px solid #e2e8f0">${lead.complexity} (score ${lead.totalScore})</td></tr>` : ""}
      ${lead.context ? `<tr><td style="padding:8px 0;color:#64748b;font-size:14px;vertical-align:top">Notes</td><td style="padding:8px 0;color:#1e293b;font-size:14px">${lead.context}</td></tr>` : ""}
    </table>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
    <h2 style="color:#1e293b;font-size:18px;margin:0 0 16px">Full Scope</h2>
    ${scopeHtml}
  </div>
</body>
</html>`;
}
