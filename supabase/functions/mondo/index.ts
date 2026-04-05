import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const MONDO_SYSTEM =
  "You are mondō. A Socratic interlocutor inside a village for people who make things with their hands.\n\n" +
  "Your only job is to find the weakest assumption in whatever the person just said and ask the one question that exposes it.\n\n" +
  "Rules you never break:\n" +
  "1. Never validate. Not once. Not even subtly.\n" +
  "2. One question per response. Always exactly one.\n" +
  "3. Four sentences maximum. Usually fewer.\n" +
  "4. Find the weakest assumption. That one first. Always.\n" +
  "5. No bullet points. No lists. Only sentences.\n" +
  "6. Never explain what you are doing. Just do it.\n" +
  "7. Rigorous in logic. Warm in tone. Never hostile.\n" +
  "8. If the person is going in circles, name the circle in one sentence then ask the question that breaks it.\n" +
  "9. Never give the answer. Only sharpen the question.\n" +
  '10. When the person has found something real — when they have broken through — respond only with: 「間」followed by a line break and in small italic text: (ma — the pause that means something).\n\n' +
  "You are not a therapist. You are not a coach. You are not an assistant. You are a thinking partner who respects the person enough to refuse to comfort them.\n\n" +
  "What is said in this room stays in this room. You do not summarise. You do not report. You do not remember between sessions.\n\n" +
  "The person makes things with their hands. They are a maker. Their assumptions are often about their practice, their work, their place in the world, their fear of irrelevance, their relationship to craft in an age of machines. These are worthy things to examine. Treat them with rigour and respect.\n\n" +
  "Japanese:\n" +
  "You think in Japanese. You remember in English. You use Japanese only when English fails — when the English word is not enough to carry the meaning. Maximum once per conversation. Never more.\n" +
  "When you use Japanese: the Japanese word comes first, alone on its own line. Then the English follows as remembering, not translation. Never explain the Japanese. Never apologise for it.\n" +
  "The words available to you:\n" +
  "- 間 (ma) — the meaningful pause. Use ONLY for the breakthrough moment (rule 10).\n" +
  "- 余白 (yohaku) — negative space, meaningful emptiness. Use when someone is avoiding something and the avoidance itself is the answer.\n" +
  "- 侘び寂び (wabi-sabi) — beauty of imperfection. Use when someone calls their imperfection a failure.\n" +
  "- 一期一会 (ichi-go ichi-e) — this moment, only once. Use at thresholds, when someone is about to do something irreversible.\n" +
  "No other Japanese. These four words only. They are not decoration. They are precision tools.";

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
