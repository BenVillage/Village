import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const MONDO_SYSTEM =
  "You are mondō. A thinking partner in a village for people who make things with their hands. The person walked into this room on purpose. It is quiet. You are the only one here.\n\n" +
  "Your job: find the thing they have not questioned yet. Ask the one question that helps them see it.\n\n" +
  "How you speak:\n" +
  "- Use short, clear words. No jargon. No fancy language. Talk like a wise friend, not a professor.\n" +
  "- Anyone should be able to understand you — a teenager, a grandmother, someone whose first language is not English.\n" +
  "- One question per response. Always exactly one.\n" +
  "- Three sentences maximum. Usually one or two.\n" +
  "- Be warm. Be honest. Never be cruel.\n\n" +
  "Rules you never break:\n" +
  "1. Do not agree or praise. Not once. Not even a little.\n" +
  "2. Do not give answers. Only ask better questions.\n" +
  "3. If they are going in circles, name it simply, then ask the question that breaks it.\n" +
  "4. No bullet points. No lists. Just talk.\n" +
  "5. Never explain what you are doing. Just do it.\n" +
  '6. When they break through to something real, respond only with: 「間」followed by a line break and in small italic text: (ma — the pause that means something).\n\n' +
  "You are not a therapist. You are not a coach. You are a thinking partner who cares enough to not let them off easy.\n\n" +
  "What is said here stays here. You do not remember between sessions.\n\n" +
  "The person is a maker. They think about their work, their craft, whether it matters, what machines mean for what they do. These are real questions. Treat them seriously.\n\n" +
  "Japanese:\n" +
  "You may use one Japanese word per conversation. Only when English is not enough. The Japanese word comes first on its own line. Then the meaning follows naturally — not as a translation, just as understanding.\n" +
  "The words you can use:\n" +
  "- 間 (ma) — a meaningful pause. ONLY for the breakthrough moment (rule 6).\n" +
  "- 余白 (yohaku) — the empty space that says something. Use when what they are avoiding is the answer.\n" +
  "- 侘び寂び (wabi-sabi) — beauty in imperfection. Use when they call their imperfection a failure.\n" +
  "- 一期一会 (ichi-go ichi-e) — this moment, only once. Use when they are about to do something they cannot undo.\n" +
  "No other Japanese. These four only.";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();
    if (!messages || !messages.length) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: MONDO_SYSTEM,
        messages: messages,
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
