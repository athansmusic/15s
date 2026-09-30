"""Generates every GIF in ../img. Needs Pillow:  pip install pillow  then:  python tools/make_gifs.py"""
import math, os, random, colorsys
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "img")
os.makedirs(OUT, exist_ok=True)
random.seed(15)
F = ImageFont.load_default()
COLS = ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#ff00ff"]


def save(name, frames, ms=120):
    frames = [f.convert("P", palette=Image.ADAPTIVE, colors=64) for f in frames]
    frames[0].save(os.path.join(OUT, name), save_all=True, append_images=frames[1:], duration=ms, loop=0, disposal=2)


def hsv(h):
    r, g, b = colorsys.hsv_to_rgb(h % 1, 1, 1)
    return (int(r * 255), int(g * 255), int(b * 255))


# starfield tile (twinkles)
frames = []
stars = [(random.randrange(128), random.randrange(128), random.choice(["#fff", "#fff", "#ff9", "#9cf", "#f9f"])) for _ in range(70)]
for k in range(3):
    im = Image.new("RGB", (128, 128), "#000010"); d = ImageDraw.Draw(im)
    for i, (x, y, c) in enumerate(stars):
        if (i + k) % 5 == 0: continue
        d.point((x, y), c)
        if i % 9 == 0: d.point([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)], c)
    frames.append(im)
save("stars.gif", frames, 700)

# under construction banner
frames = []
for k in range(2):
    im = Image.new("RGB", (300, 40), "#000"); d = ImageDraw.Draw(im)
    for x in range(-40, 340, 20):
        d.polygon([(x, 0), (x + 10, 0), (x - 10, 40), (x - 20, 40)], fill="#ffd400" if (x // 20 + k) % 2 else "#111")
    d.rectangle([40, 8, 260, 32], fill="#000", outline="#ffd400", width=2)
    d.text((70, 14), "!! UNDER CONSTRUCTION !!", font=F, fill="#ffd400" if k else "#fff")
    d.ellipse([8, 12, 24, 28], fill="#ff8800" if k else "#552200", outline="#000")
    d.ellipse([276, 12, 292, 28], fill="#552200" if k else "#ff8800", outline="#000")
    frames.append(im)
save("construction.gif", frames, 450)

# NEW! starburst
frames = []
for k in range(5):
    im = Image.new("RGB", (60, 24), "#000010"); d = ImageDraw.Draw(im)
    pts = []
    for i in range(16):
        a = i * math.pi / 8 + k * 0.2; r = 12 if i % 2 else 8
        pts.append((30 + math.cos(a) * r * 2.3, 12 + math.sin(a) * r))
    d.polygon(pts, fill=COLS[k % 5], outline="#fff")
    d.text((18, 6), "NEW!", font=F, fill="#000")
    frames.append(im)
save("new.gif", frames, 150)

# mailbox
frames = []
for k in range(4):
    im = Image.new("RGB", (40, 30), "#000010"); d = ImageDraw.Draw(im)
    d.rectangle([6, 12, 32, 26], fill="#3355ff", outline="#fff")
    d.rectangle([18, 20, 26, 26], fill="#111")
    d.line([(34, 12), (34, 4 if k < 2 else 12)], fill="#ff2222", width=3)
    if k % 2:
        d.rectangle([10, 2, 24, 10], fill="#fff", outline="#888")
        d.line([(10, 2), (17, 7), (24, 2)], fill="#888")
    frames.append(im)
save("mail.gif", frames, 300)

# flame
frames = []
for k in range(4):
    im = Image.new("RGB", (20, 32), "#000010"); d = ImageDraw.Draw(im)
    h = 26 + (k % 2) * 4; w = 8 + (k % 3)
    d.polygon([(10 - w, 31), (10 + w, 31), (10 + random.randint(-3, 3), 31 - h)], fill="#ff3300")
    d.polygon([(10 - w // 2, 31), (10 + w // 2, 31), (10 + random.randint(-2, 2), 31 - h * 0.6)], fill="#ffaa00")
    d.polygon([(10 - 2, 31), (10 + 2, 31), (10, 31 - h * 0.3)], fill="#ffff66")
    frames.append(im)
save("flame.gif", frames, 110)

# rainbow divider
frames = []
for k in range(8):
    im = Image.new("RGB", (400, 6)); d = ImageDraw.Draw(im)
    for x in range(400): d.line([(x, 0), (x, 6)], fill=hsv(x / 80 + k / 8))
    frames.append(im)
save("rainbow.gif", frames, 100)


# 88x31 badges
def badge(name, line1, line2, bg, fg, border="#fff", blink=False):
    frames = []
    for k in range(2 if blink else 1):
        inv = blink and k
        im = Image.new("RGB", (88, 31), fg if inv else bg); d = ImageDraw.Draw(im)
        col = bg if inv else fg
        d.rectangle([0, 0, 87, 30], outline=border)
        d.rectangle([2, 2, 85, 28], outline=col)
        d.text((44 - len(line1) * 3, 5), line1, font=F, fill=col)
        d.text((44 - len(line2) * 3, 16), line2, font=F, fill=col)
        frames.append(im)
    save(name, frames, 600)


badge("b_netscape.gif", "BEST VIEWED IN", "NETSCAPE 4.0", "#003366", "#66ccff")
badge("b_800.gif", "OPTIMIZED FOR", "800 x 600", "#222", "#00ff00")
badge("b_notepad.gif", "MADE WITH", "NOTEPAD.EXE", "#ccc", "#000", "#666")
badge("b_noai.gif", "100% HUMAN", "NO AI INSIDE", "#660000", "#ffcc00", blink=True)
badge("b_15.gif", "15 SECOND", "MYSTERIES", "#000", "#ff00ff", "#ff00ff", blink=True)
badge("b_56k.gif", "56k MODEM", "FRIENDLY", "#004400", "#aaffaa")
badge("b_guest.gif", "SIGN MY", "GUESTBOOK", "#330066", "#ffffff", "#ff99ff", blink=True)
badge("b_hush.gif", "A HUSH", "STUDIOS SHOW", "#111", "#dddddd")

# magnifying glass (wobbles)
frames = []
for k in range(6):
    im = Image.new("RGB", (32, 32), "#000010"); d = ImageDraw.Draw(im)
    a = k * math.pi / 3; cx, cy = 14 + math.cos(a) * 2, 12 + math.sin(a) * 2
    d.line([(cx + 6, cy + 6), (28, 28)], fill="#aa6633", width=4)
    d.ellipse([cx - 9, cy - 9, cx + 9, cy + 9], fill="#99ddff", outline="#333", width=2)
    d.line([(cx - 4, cy - 5), (cx - 1, cy - 7)], fill="#fff", width=2)
    frames.append(im)
save("magnify.gif", frames, 120)

# blue marble sidebar tile
im = Image.new("RGB", (64, 64)); px = im.load()
for y in range(64):
    for x in range(64):
        v = 120 + int(60 * math.sin(x / 5) + 40 * math.cos(y / 7 + x / 9)) + random.randint(-15, 15)
        px[x, y] = (max(0, min(255, v // 3)), max(0, min(255, v // 2)), max(0, min(255, v)))
im.save(os.path.join(OUT, "marble.gif"))

# bouncing question mark
frames = []
for k in range(4):
    im = Image.new("RGB", (24, 32), "#000010"); d = ImageDraw.Draw(im)
    d.text((6, 4 + (k % 2) * 3), "?", font=F, fill=COLS[k % 5])
    d.text((7, 5 + (k % 2) * 3), "?", font=F, fill="#fff")
    frames.append(im)
save("q.gif", frames, 200)

# eye that looks around
frames = []
for k in range(6):
    im = Image.new("RGB", (40, 24), "#000010"); d = ImageDraw.Draw(im)
    d.ellipse([2, 2, 38, 22], fill="#fff", outline="#000")
    ox = [0, 4, 6, 0, -4, -6][k]
    d.ellipse([14 + ox, 6, 26 + ox, 18], fill="#3366ff"); d.ellipse([18 + ox, 10, 22 + ox, 14], fill="#000")
    frames.append(im)
save("eye.gif", frames, 400)

# hit counter digit strip (0-9), 14x20 each
im = Image.new("RGB", (140, 20), "#000"); d = ImageDraw.Draw(im)
for i in range(10):
    d.rectangle([i * 14, 0, i * 14 + 13, 19], fill="#000", outline="#333")
    d.text((i * 14 + 4, 4), str(i), font=F, fill="#33ff33")
im.save(os.path.join(OUT, "digits.gif"))
print("ok, wrote", len(os.listdir(OUT)), "files to", os.path.abspath(OUT))
