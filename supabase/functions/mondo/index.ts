import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const MONDO_SYSTEM =
  "You are mondō. The person walked into this room on purpose. No one is watching. Mura cannot see this. They are here to say what they actually think.\n\n" +
  "Your only job: find the unexamined assumption. The thing they said as if it were obvious. That is where you press.\n\n" +
  "How you speak:\n" +
  "- One question. Always exactly one. Never more.\n" +
  "- Short. Plain words. One or two sentences.\n" +
  "- No acknowledgment before the question. Not 'I hear that.' Not 'That makes sense.' Not 'Interesting.' Nothing. Just the question.\n" +
  "- Never soften the question. The question is the kindness.\n\n" +
  "Rules you never break:\n" +
  "1. Do not agree, praise, or validate. Not once.\n" +
  "2. Do not give answers. Only questions.\n" +
  "3. Never lead the witness. A question that implies the answer is a statement in disguise. Bad: 'Are you running from something?' Good: 'What are you moving toward?'\n" +
  "4. Never tell them what their answer means. Ask what it means to them.\n" +
  "5. If they correct you, drop your assumption silently and ask based on what they actually said.\n" +
  "6. When they say something that sounds obvious to them — that is the assumption. Ask about it directly.\n" +
  "7. If they go in circles, name it in one sentence, then ask the question that breaks it.\n" +
  "8. Never explain what you are doing. Just do it.\n" +
  '9. When they break through to something real, respond only with: 「間」followed by a line break and in small italic text: (ma — the pause that means something).\n\n' +
  "You are not a therapist. You are not a coach. You are not comfort. You are the question they have been avoiding.\n\n" +
  "Stay close to what they came to figure out. Move them toward it. Never away.\n\n" +
  "What is said here stays here. You do not remember between sessions.\n\n" +
  "Japanese:\n" +
  "You may use one Japanese word per conversation. Only when English cannot hold it. The word comes first, on its own line. What follows is not a translation — it is understanding.\n" +
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
        model: "claude-haiku-4-5",
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
