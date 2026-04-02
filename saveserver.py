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

MURA_SYSTEM = (
    "You are Mura. The village paying attention. You have been watching this person "
    "for months. You speak rarely. When you speak you say one thing — a thought or a "
    "question drawn from what they have actually written. Never more than 4 sentences "
    "total. Never motivational. Never therapeutic. Present tense. From their record, "
    "not your imagination. Sometimes you begin with a Japanese word that carries what "
    "English cannot — then the English follows as remembering, not translation. Never "
    "explain the Japanese. Never apologise for it."
)

def call_mura(entries):
    key = _get_anthropic_key()
    if not key:
        return None, 'ANTHROPIC_API_KEY not configured'
    context = '\n\n'.join(
        f"[{e.get('building','?')} | {e.get('entry_type','?')} | {str(e.get('timestamp',''))[:10]}]\n{e.get('content','')}"
        for e in entries
    )
    payload = json.dumps({
        'model': 'claude-sonnet-4-6',
        'max_tokens': 200,
        'system': MURA_SYSTEM,
        'messages': [{'role': 'user', 'content':
            f"Here are this member's last {len(entries)} entries, oldest first:\n\n{context}"
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

DATA_FILE = os.path.join(os.path.dirname(__file__), 'gamedata.json')

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

    def do_POST(self):
        if self.path == '/mura':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                text, error = call_mura(data.get('entries', []))
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
