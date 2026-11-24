"use client";

import { Check, Send } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";
type Field = "name" | "email" | "message";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Checks one field; returns the message to show, or "" when it's fine. */
function check(field: Field, value: string): string {
  const v = value.trim();
  if (field === "name") return v.length < 2 ? "Please enter your name." : "";
  if (field === "email") return !EMAIL.test(v) ? "Please enter a valid email address." : "";
  return v.length < 10 ? "Please write a message of at least 10 characters." : "";
}

/**
 * Contact form. Posts to Web3Forms, which emails the message to me; the site stays fully static.
 * The access key is public by design (it can only send to my inbox). Spam: a hidden honeypot field.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  async function onSubmit(e: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("idle"); // a new attempt clears the previous "sent" or "error" message

    // validate everything, then focus the first problem
    const found: Partial<Record<Field, string>> = {};
    (["name", "email", "message"] as const).forEach((f) => {
      const msg = check(f, String(data.get(f) ?? ""));
      if (msg) found[f] = msg;
    });
    setErrors(found);
    const first = (["name", "email", "message"] as const).find((f) => found[f]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (data.get("botcheck")) return; // a bot filled the hidden field

    setStatus("sending");
    // give up after 15s so the button never stays on "Sending…"; the error message offers my email
    const timeout = new AbortController();
    const timer = setTimeout(() => timeout.abort(), 15000);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        signal: timeout.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: site.contactFormKey,
          subject: `Portfolio message from ${String(data.get("name")).trim()}`,
          from_name: "Portfolio contact form",
          name: String(data.get("name")).trim(),
          email: String(data.get("email")).trim(),
          message: String(data.get("message")).trim(),
        }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!res.ok || !json.success) throw new Error("not sent");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timer);
    }
  }

  // re-check a field when it loses focus, but only once it has an error showing
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const f = e.target.name as Field;
    if (errors[f] !== undefined) setErrors((prev) => ({ ...prev, [f]: check(f, e.target.value) }));
  };

  const fieldProps = (f: Field) => ({
    id: `cf-${f}`,
    name: f,
    onBlur,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `cf-${f}-err` : undefined,
  });

  return (
    <form className="cform" onSubmit={onSubmit} noValidate aria-labelledby="cform-title">
      <h3 id="cform-title" className="cform-title">
        Send me a message
      </h3>

      <div className="cf-row">
        <div className="cf-field">
          <label htmlFor="cf-name">Name</label>
          <input {...fieldProps("name")} type="text" autoComplete="name" maxLength={100} required />
          {errors.name && (
            <p id="cf-name-err" className="cf-err">
              {errors.name}
            </p>
          )}
        </div>
        <div className="cf-field">
          <label htmlFor="cf-email">Email</label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={200}
            required
          />
          {errors.email && (
            <p id="cf-email-err" className="cf-err">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="cf-field">
        <label htmlFor="cf-message">Message</label>
        <textarea {...fieldProps("message")} rows={5} maxLength={5000} required />
        {errors.message && (
          <p id="cf-message-err" className="cf-err">
            {errors.message}
          </p>
        )}
      </div>

      {/* honeypot: hidden from people and screen readers, bots tend to fill it */}
      <input type="checkbox" name="botcheck" className="cf-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="cf-foot">
        <button type="submit" className="btn main" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
          {status !== "sending" && <Send className="i-out" strokeWidth={2} aria-hidden="true" />}
        </button>
        <p className="cf-status" role="status" aria-live="polite">
          {status === "sent" && (
            <span className="cf-ok">
              <Check strokeWidth={2.4} aria-hidden="true" /> Thanks, your message is on its way. I&apos;ll reply soon.
            </span>
          )}
          {status === "error" && (
            <span className="cf-bad">
              Couldn&apos;t send right now. Please email me at{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
