#!/usr/bin/env python3
"""
Create placeholder images for Still Basing Base Mini App
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Brand colors
BLUE = '#0000FF'
WHITE = '#FFFFFF'
BLACK = '#000000'

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_icon_1024():
    """Create 1024x1024 app icon"""
    img = Image.new('RGB', (1024, 1024), hex_to_rgb(BLUE))
    draw = ImageDraw.Draw(img)

    # Draw large "S" for Still Basing
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 500)
    except:
        font = ImageFont.load_default()

    text = "S"
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (1024 - text_width) // 2
    y = (1024 - text_height) // 2 - 50

    draw.text((x, y), text, fill=hex_to_rgb(WHITE), font=font)

    img.save('public/icon-1024.png', 'PNG')
    print("✓ Created icon-1024.png")

def create_splash_200():
    """Create 200x200 splash screen"""
    img = Image.new('RGB', (200, 200), hex_to_rgb(BLUE))
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 100)
    except:
        font = ImageFont.load_default()

    text = "S"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (200 - text_width) // 2
    y = (200 - text_height) // 2 - 10

    draw.text((x, y), text, fill=hex_to_rgb(WHITE), font=font)

    img.save('public/splash-200.png', 'PNG')
    print("✓ Created splash-200.png")

def create_hero_1200x630():
    """Create 1200x630 hero image"""
    img = Image.new('RGB', (1200, 630), hex_to_rgb(BLUE))
    draw = ImageDraw.Draw(img)

    # Title
    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except:
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()

    # Draw title
    title = "Still Basing"
    bbox = draw.textbbox((0, 0), title, font=font_title)
    title_width = bbox[2] - bbox[0]
    x = (1200 - title_width) // 2
    draw.text((x, 180), title, fill=hex_to_rgb(WHITE), font=font_title)

    # Draw subtitle
    subtitle = "Click to Grow on Base"
    bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    subtitle_width = bbox[2] - bbox[0]
    x = (1200 - subtitle_width) // 2
    draw.text((x, 300), subtitle, fill=hex_to_rgb(WHITE), font=font_subtitle)

    # Draw emoji-style decorations
    draw.text((500, 380), "🎮  🏆  🎨", fill=hex_to_rgb(WHITE), font=font_subtitle)

    img.save('public/hero-1200x630.png', 'PNG')
    print("✓ Created hero-1200x630.png")

def create_og_1200x630():
    """Create 1200x630 OG image (similar to hero)"""
    img = Image.new('RGB', (1200, 630), hex_to_rgb(BLUE))
    draw = ImageDraw.Draw(img)

    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 70)
        font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 35)
    except:
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()

    # Draw title
    title = "Still Basing"
    bbox = draw.textbbox((0, 0), title, font=font_title)
    title_width = bbox[2] - bbox[0]
    x = (1200 - title_width) // 2
    draw.text((x, 150), title, fill=hex_to_rgb(WHITE), font=font_title)

    # Draw subtitle
    subtitle1 = "On-Chain Clicker Game"
    bbox = draw.textbbox((0, 0), subtitle1, font=font_subtitle)
    subtitle_width = bbox[2] - bbox[0]
    x = (1200 - subtitle_width) // 2
    draw.text((x, 260), subtitle1, fill=hex_to_rgb(WHITE), font=font_subtitle)

    subtitle2 = "Earn Achievements • Claim NFTs"
    bbox = draw.textbbox((0, 0), subtitle2, font=font_subtitle)
    subtitle_width = bbox[2] - bbox[0]
    x = (1200 - subtitle_width) // 2
    draw.text((x, 320), subtitle2, fill=hex_to_rgb(WHITE), font=font_subtitle)

    # Base branding
    base_text = "Built on Base"
    try:
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 25)
    except:
        font_small = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), base_text, font=font_small)
    text_width = bbox[2] - bbox[0]
    x = (1200 - text_width) // 2
    draw.text((x, 450), base_text, fill=hex_to_rgb(WHITE), font=font_small)

    img.save('public/og-1200x630.png', 'PNG')
    print("✓ Created og-1200x630.png")

def create_screenshot(filename, title, description):
    """Create 1284x2778 portrait screenshot placeholder"""
    img = Image.new('RGB', (1284, 2778), hex_to_rgb(WHITE))
    draw = ImageDraw.Draw(img)

    # Header bar (simulating mobile app)
    draw.rectangle([(0, 0), (1284, 200)], fill=hex_to_rgb(BLUE))

    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        font_desc = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except:
        font_title = ImageFont.load_default()
        font_desc = ImageFont.load_default()

    # Title in header
    bbox = draw.textbbox((0, 0), title, font=font_title)
    title_width = bbox[2] - bbox[0]
    x = (1284 - title_width) // 2
    draw.text((x, 70), title, fill=hex_to_rgb(WHITE), font=font_title)

    # Main content area with blue accent
    draw.rectangle([(100, 400), (1184, 1400)], fill=hex_to_rgb(BLUE))

    # Description text
    desc_lines = description.split('\n')
    y = 1600
    for line in desc_lines:
        bbox = draw.textbbox((0, 0), line, font=font_desc)
        line_width = bbox[2] - bbox[0]
        x = (1284 - line_width) // 2
        draw.text((x, y), line, fill=hex_to_rgb(BLACK), font=font_desc)
        y += 80

    # Bottom navigation bar
    draw.rectangle([(0, 2578), (1284, 2778)], fill=hex_to_rgb('#F5F5F5'))

    img.save(f'public/{filename}', 'PNG')
    print(f"✓ Created {filename}")

def main():
    # Create public directory if it doesn't exist
    os.makedirs('public', exist_ok=True)

    print("Creating placeholder images for Still Basing Base Mini App...")
    print("Colors: Blue #0000FF, White #FFFFFF")
    print()

    # Create all images
    create_icon_1024()
    create_splash_200()
    create_hero_1200x630()
    create_og_1200x630()

    create_screenshot('screenshot-1.png', 'Play',
                     'Click the button to grow\n"Still Basing"\nEarn achievements on-chain')

    create_screenshot('screenshot-2.png', 'Stats',
                     'View your progress\nTrack milestones\nSee achievements')

    create_screenshot('screenshot-3.png', 'NFTs',
                     'Claim achievement NFTs\nUnlock rewards\nCollect unique badges')

    print()
    print("✅ All placeholder images created successfully!")
    print("Note: These are basic placeholders. For production, create professional designs.")

if __name__ == '__main__':
    main()
