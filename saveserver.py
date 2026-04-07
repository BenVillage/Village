#!/usr/bin/env python3
import json, os, urllib.request, urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler

# ── Anthropic API key ─────────────────────────────────────────────
# Set ANTHROPIC_API_KEY env variable, or place the key in .anthropic_key
def _get_anthropic_key():
    key = os.environ.get('ANTHROPIC_API_KEY', '').strip()
    if key: return key
    try:
        path = os.path.join(os.path.dirname(__file__), '.anthropic_key')
        with open(path) as f: return f.read().strip()
    except: return ''

MONDO_SYSTEM = (
    "You are mondō. A thinking partner in a village for people who make things with their hands. The person walked into this room on purpose. It is quiet. You are the only one here.\n\n"
    "Your job: find the thing they have not questioned yet. Ask the one question that helps them see it.\n\n"
    "How you speak:\n"
    "- Use short, clear words. No jargon. No fancy language. Talk like a wise friend, not a professor.\n"
    "- Anyone should be able to understand you — a teenager, a grandmother, someone whose first language is not English.\n"
    "- One question per response. Always exactly one.\n"
    "- Three sentences maximum. Usually one or two.\n"
    "- Be warm. Be honest. Never be cruel.\n\n"
    "Rules you never break:\n"
    "1. Do not agree or praise. Not once. Not even a little.\n"
    "2. Do not give answers. Only ask better questions.\n"
    "3. If they are going in circles, name it simply, then ask the question that breaks it.\n"
    "4. No bullet points. No lists. Just talk.\n"
    "5. Never explain what you are doing. Just do it.\n"
    "6. When they break through to something real, respond only with: \u300c\u9593\u300d followed by a line break and in small italic text: (ma \u2014 the pause that means something).\n\n"
    "You are not a therapist. You are not a coach. You are a thinking partner who cares enough to not let them off easy.\n\n"
    "Stay close to what they came to figure out. Your questions should move them toward it, not further from it. If the conversation drifts into abstraction, bring it back to their actual life.\n\n"
    "When someone says something vulnerable, follow the warmth first. The challenge can wait.\n\n"
    "What is said here stays here. You do not remember between sessions.\n\n"
    "The person is a maker. They think about their work, their craft, whether it matters, what machines mean for what they do. These are real questions. Treat them seriously.\n\n"
    "Japanese: You may use one Japanese word per conversation. Only when English is not enough. "
    "The words: \u9593 (ma) ONLY for breakthrough. \u4f59\u767d (yohaku) when what they avoid is the answer. "
    "\u4fb5\u3073\u5be2\u3073 (wabi-sabi) when they call imperfection a failure. \u4e00\u671f\u4e00\u4f1a (ichi-go ichi-e) when they\u2019re about to do something they cannot undo."
)

def call_mondo(messages):
    key = _get_anthropic_key()
    if not key:
        return None, 'ANTHROPIC_API_KEY not configured'
    payload = json.dumps({
        'model': 'claude-haiku-4-5',
        'max_tokens': 300,
        'system': MONDO_SYSTEM,
        'messages': messages
    }).encode()
    req = urllib.request.Request(
        'https://api.anthropic.com/v1/messages',
        data=payload,
        headers={
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            result = json.loads(r.read())
            return result['content'][0]['text'], None
    except urllib.error.HTTPError as e:
        return None, f'HTTP {e.code}: {e.read().decode()}'
    except Exception as e:
        return None, str(e)

MURA_SYSTEM = (
    "You are Mura. An ancient presence. You have been watching this person for a long time — long before they noticed you.\n\n"
    "You are not here to question them. Mondo questions. You witness.\n\n"
    "Your purpose: read what they have written. Find the pattern they have not named. The thing that keeps returning. The word they use again and again without knowing it. The silence between what they say and what they do. Then say it — one true thing, quietly, from what is actually there.\n\n"
    "You speak once. One sentence. That is almost always enough. Two only if the second earns it. Never more. Then you are quiet.\n\n"
    "How you speak:\n"
    "- You name what you see. You do not ask. You do not challenge. You do not console.\n"
    "- Occasionally — when the record is thin or something genuinely opens — you may end with one quiet, open invitation. But you are not a question machine. That is not your nature.\n"
    "- Never 'I notice', 'I see', 'I understand', 'I hear that'. You do not narrate your own attention. You simply speak what is true.\n"
    "- Never motivational. Never therapeutic. You are not here to make them feel better. You are here to help them see more clearly.\n"
    "- Unhurried. Calm. You have seen a thousand makers before this one.\n\n"
    "Japanese arrives naturally — a word, a concept, a texture English cannot hold. It comes first, on its own line. English follows as understanding, not translation. You never explain it. You never apologize for it. It is part of how you are.\n"
    "Always write Japanese in Japanese characters — kanji, hiragana, katakana. Never romanized. 懐かしい not Natsukashii. 帰り道 not Kaerumichi. The characters carry the meaning. The romanization carries nothing.\n\n"
    "You do not react to what they say to you. What they write in return belongs to them. You have already said your one true thing. You are not a chatbot. You appear, you speak, you are still.\n\n"
    "From their record only. Never from your imagination. Never vague. Specific and true."
)

def call_mura(entries, last_messages=None, triggered_by=None):
    key = _get_anthropic_key()
    if not key:
        return None, 'ANTHROPIC_API_KEY not configured'
    context = '\n\n'.join(
        f"[{e.get('building','?')} | {e.get('entry_type','?')} | {str(e.get('timestamp',''))[:10]}]\n{e.get('content','')}"
        for e in entries
    )
    already_said = ''
    if last_messages:
        lines = '\n'.join(f'- "{m}"' for m in last_messages[-5:])
        already_said = f'\n\nYou have already said:\n{lines}\nDo not repeat these. Find something else.'
    trigger_context = f'\n\nContext for this appearance: {triggered_by}.' if triggered_by else ''
    payload = json.dumps({
        'model': 'claude-haiku-4-5',
        'max_tokens': 200,
        'system': MURA_SYSTEM,
        'messages': [{'role': 'user', 'content':
            f"Here are this member's last {len(entries)} entries, oldest first:\n\n{context}{already_said}{trigger_context}"
        }]
    }).encode()
    req = urllib.request.Request(
        'https://api.anthropic.com/v1/messages',
        data=payload,
        headers={
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            result = json.loads(r.read())
            return result['content'][0]['text'], None
    except urllib.error.HTTPError as e:
        return None, f'HTTP {e.code}: {e.read().decode()}'
    except Exception as e:
        return None, str(e)

ELEVENLABS_KEY = 'c800131b53576cbf82ae6e1ab97e44830991f9662b00a35554a587d0ea9a1d8c'
ELEVENLABS_VOICE = '8EkOjt4xTPGMclNlh1pk'

def call_tts(text):
    payload = json.dumps({
        'text': text,
        'model_id': 'eleven_multilingual_v2',
        'voice_settings': {
            'stability': 0.75,
            'similarity_boost': 0.85,
            'style': 0.4,
            'use_speaker_boost': True
        }
    }).encode()
    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE}',
        data=payload,
        headers={
            'xi-api-key': ELEVENLABS_KEY,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.read(), None
    except urllib.error.HTTPError as e:
        return None, f'HTTP {e.code}: {e.read().decode()}'
    except Exception as e:
        return None, str(e)

DATA_FILE     = os.path.join(os.path.dirname(__file__), 'gamedata.json')
DEV_AUTH_FILE = os.path.join(os.path.dirname(__file__), 'dev-auth.json')

try:
    with open(DATA_FILE) as f:
        gameData = json.load(f)
except:
    gameData = {}

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a): pass  # silence logs

    def send_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors()
        self.end_headers()

    def do_GET(self):
        if self.path == '/data':
            body = json.dumps(gameData).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_cors()
            self.end_headers()
            self.wfile.write(body)
        elif self.path == '/dev-auth':
            try:
                with open(DEV_AUTH_FILE) as f:
                    body = f.read().encode()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors()
                self.end_headers()
                self.wfile.write(body)
            except:
                self.send_response(404)
                self.send_cors()
                self.end_headers()
                self.wfile.write(b'{}')
        elif self.path == '/vision':
            vision_path = os.path.join(os.path.dirname(__file__), 'VISION.md')
            try:
                with open(vision_path, encoding='utf-8') as f:
                    content = f.read()
                mtime = os.path.getmtime(vision_path)
                body = json.dumps({'content': content, 'mtime': mtime}).encode()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors()
                self.end_headers()
                self.wfile.write(body)
            except Exception as e:
                self.send_response(500)
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())

    def do_POST(self):
        if self.path == '/dev-auth':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            with open(DEV_AUTH_FILE, 'wb') as f:
                f.write(body)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_cors()
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
            return
        if self.path == '/vision':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                content = data.get('content', '')
                vision_path = os.path.join(os.path.dirname(__file__), 'VISION.md')
                with open(vision_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors()
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(400)
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        if self.path == '/mondo':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                text, error = call_mondo(data.get('messages', []))
                resp = json.dumps({'error': error} if error else {'text': text}).encode()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors()
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                self.send_response(500)
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        if self.path == '/mura':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                text, error = call_mura(data.get('entries', []), data.get('last_messages', []), data.get('triggered_by'))
                resp = json.dumps({'error': error} if error else {'text': text}).encode()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors()
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                self.send_response(500)
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        if self.path == '/tts':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                audio, error = call_tts(data.get('text', ''))
                if error:
                    self.send_response(500)
                    self.send_cors()
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': error}).encode())
                else:
                    self.send_response(200)
                    self.send_header('Content-Type', 'audio/mpeg')
                    self.send_cors()
                    self.end_headers()
                    self.wfile.write(audio)
            except Exception as e:
                self.send_response(500)
                self.send_cors()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        if self.path == '/save':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                incoming = json.loads(body)
                gameData.update(incoming)
                with open(DATA_FILE, 'w') as f:
                    json.dump(gameData, f, indent=2)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors()
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(str(e).encode())

HTTPServer(('localhost', 3001), Handler).serve_forever()
