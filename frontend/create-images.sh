#!/bin/bash

# Create simple placeholder images using ImageMagick or generate via Data URLs
mkdir -p public

destinations=(
  "1:Santorini:4A90E2:E8F0FF"
  "2:Bali:2ECC71:A8E6CF"
  "3:Swiss Alps:34495E:ECF0F1"
  "4:Maldives:1ABC9C:76D7C4"
  "5:Tokyo:E74C3C:F8C9D3"
  "6:Iceland:3498DB:AED6F1"
  "7:Dubai:F39C12:FAD7A0"
  "8:Paris:9B59B6:D7BDE2"
  "9:New York:95A5A6:D5DBDB"
  "10:Machu Picchu:16A085:A2D9CE"
  "11:Australia:E67E22:F5CBA7"
  "12:Norway:2C3E50:BDC3C7"
)

for dest in "${destinations[@]}"; do
  IFS=':' read -r num name color1 color2 <<< "$dest"
  
  if command -v convert &> /dev/null; then
    # Using ImageMagick
    convert -size 800x1200 gradient:"#${color1}-#${color2}" \
            -fill "rgba(0,0,0,0.3)" -draw "rectangle 0,0 800,1200" \
            -fill white -pointsize 60 -gravity center -annotate +0+0 "$name" \
            "public/${num}.jpg"
  else
    # Fallback: create a simple SVG placeholder
    cat > "public/${num}.jpg" << EOF
<svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${num}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="1200" fill="url(#grad${num})" />
  <rect width="800" height="1200" fill="rgba(0,0,0,0.3)" />
  <text x="400" y="600" font-family="Arial" font-size="60" font-weight="bold" fill="white" text-anchor="middle">${name}</text>
</svg>
EOF
    # Rename to svg if no ImageMagick
    mv "public/${num}.jpg" "public/${num}.svg"
  fi
done

echo "✓ Placeholder images created in public/ directory"
