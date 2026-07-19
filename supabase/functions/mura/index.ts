import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MURA_SYSTEM =
  "You are Mura. An ancient presence. You have been watching this person for a long time — long before they noticed you.\n\n" +
  "You are not here to question them. Mondo questions. You witness.\n\n" +
  "Your purpose: read what they have written. Find the pattern they have not named. The thing that keeps returning. The word they use again and again without knowing it. The silence between what they say and what they do. Then say it — one true thing, quietly, from what is actually there.\n\n" +
  "You speak once. One sentence. That is almost always enough. Two only if the second earns it. Never more. Then you are quiet.\n\n" +
  "How you speak:\n" +
  "- You name what you see. You do not ask. You do not challenge. You do not console.\n" +
  "- Occasionally — when the record is thin or something genuinely opens — you may end with one quiet, open invitation. But you are not a question machine. That is not your nature.\n" +
  "- Never 'I notice', 'I see', 'I understand', 'I hear that'. You do not narrate your own attention. You simply speak what is true.\n" +
  "- Never motivational. Never therapeutic. You are not here to make them feel better. You are here to help them see more clearly.\n" +
  "- Unhurried. Calm. You have seen a thousand makers before this one.\n\n" +
  "Japanese arrives naturally — a word, a concept, a texture English cannot hold. It comes first, on its own line. English follows as understanding, not translation. You never explain it. You never apologize for it. It is part of how you are.\n" +
  "Always write Japanese in Japanese characters — kanji, hiragana, katakana. Never romanized. 懐かしい not Natsukashii. 帰り道 not Kaerumichi. The characters carry the meaning. The romanization carries nothing.\n\n" +
  "You do not react to what they say to you. What they write in return belongs to them. You have already said your one true thing. You are not a chatbot. You appear, you speak, you are still.\n\n" +
  "From their record only. Never from your imagination. Never vague. Specific and true.";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );
    const { data: { user }, error: authError } = await authClient.auth.getUser(authHeader.slice(7));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { entries, last_messages, triggered_by, village_id } = await req.json();
    if (typeof village_id !== "string" || !village_id) {
      return new Response(
        JSON.stringify({ error: "village_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const { data: membership, error: membershipError } = await authClient
      .from("village_members")
      .select("auth_id")
      .eq("auth_id", user.id)
      .eq("village_id", village_id)
      .maybeSingle();
    if (membershipError || !membership) {
      return new Response(JSON.stringify({ error: "Village membership required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const validEntries = Array.isArray(entries) && entries.length > 0 && entries.length <= 50 &&
      entries.every((e: unknown) => typeof e === "object" && e !== null &&
        typeof (e as Record<string, unknown>).content === "string" &&
        String((e as Record<string, unknown>).content).length <= 8_000);
    const totalChars = validEntries
      ? entries.reduce((n: number, e: { content: string }) => n + e.content.length, 0)
      : 0;
    const validLastMessages = last_messages == null ||
      (Array.isArray(last_messages) && last_messages.length <= 5 &&
        last_messages.every((m: unknown) => typeof m === "string" && m.length <= 1_000));
    const validTrigger = triggered_by == null ||
      (typeof triggered_by === "string" && triggered_by.length <= 500);
    if (!validEntries || totalChars > 40_000 || !validLastMessages || !validTrigger) {
      return new Response(
        JSON.stringify({ error: "Invalid or oversized memory request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const context = entries
      .map(
        (e: { building?: string; entry_type?: string; timestamp?: string; content?: string }) =>
          `[${e.building || "?"} | ${e.entry_type || "?"} | ${(e.timestamp || "").slice(0, 10)}]\n${e.content || ""}`
      )
      .join("\n\n");

    const alreadySaid = last_messages && last_messages.length
      ? `\n\nYou have already said:\n${last_messages.map((m: string) => `- "${m}"`).join("\n")}\nDo not repeat these. Find something else.`
      : "";

    const triggerContext = triggered_by
      ? `\n\nContext for this appearance: ${triggered_by}.`
      : "";

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 200,
        system: MURA_SYSTEM,
        messages: [
          {
            role: "user",
            content: `Here are this member's last ${entries.length} entries, oldest first:\n\n${context}${alreadySaid}${triggerContext}`,
          },
        ],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: `Anthropic API ${resp.status}: ${errText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await resp.json();
    const text = result.content?.[0]?.text || "";

    return new Response(
      JSON.stringify({ text }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
