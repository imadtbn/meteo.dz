import os
import sys
import json
import re

print("Running Comprehensive Verification Test Suite for 'أجواء | Ajwaa Weather'...")

# 1. Verify 69 Algerian Wilayas
cities_file = "data/cities.json"
assert os.path.exists(cities_file), "Missing data/cities.json"
with open(cities_file, "r", encoding="utf-8") as f:
    cities = json.load(f)

assert len(cities) == 69, f"Expected 69 wilayas, got {len(cities)}"
print(f"✓ Confirmed exactly 69 wilayas in {cities_file}")

# Check wilaya slugs and files
for city in cities:
    slug = city["slug"]
    html_path = os.path.join("weather", slug, "index.html")
    assert os.path.exists(html_path), f"Missing standalone wilaya page: {html_path}"
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()
        assert "<!doctype html>" in content.lower(), f"Invalid HTML in {html_path}"
        assert city["name"] in content, f"Missing city name {city['name']} in {html_path}"
        assert str(city["code"]) in content, f"Missing code {city['code']} in {html_path}"
        assert "application/ld+json" in content, f"Missing Schema.org JSON-LD in {html_path}"
        assert 'name="description"' in content, f"Missing meta description in {html_path}"
        assert "أجواء" in content, f"Missing branding in {html_path}"

print("✓ All 69 standalone wilaya pages exist, have valid HTML, Schema.org LD+JSON, and SEO tags.")

# 2. Verify Arab Capitals
capitals_file = "data/arab-capitals.json"
assert os.path.exists(capitals_file), "Missing data/arab-capitals.json"
with open(capitals_file, "r", encoding="utf-8") as f:
    capitals = json.load(f)
assert len(capitals) == 22, f"Expected 22 Arab capitals, got {len(capitals)}"
print(f"✓ Confirmed exactly 22 Arab capitals in {capitals_file}")

# 3. Verify Key Pages
key_pages = [
    "index.html",
    "wilayas/index.html",
    "arab-capitals/index.html",
    "world-search/index.html",
    "map/index.html",
    "climate-observatory/index.html",
    "agriculture-weather/index.html",
    "alerts/index.html",
    "favorites/index.html",
    "marine/index.html",
    "global-weather/index.html"
]

for page in key_pages:
    assert os.path.exists(page), f"Missing key page: {page}"
    with open(page, "r", encoding="utf-8") as f:
        content = f.read()
        assert "<!doctype html>" in content.lower(), f"Invalid HTML in {page}"
        assert "أجواء" in content, f"Missing branding in {page}"
        assert "header class=\"site-header\"" in content, f"Missing header in {page}"
        assert "footer class=\"site-footer\"" in content, f"Missing footer in {page}"

print(f"✓ All {len(key_pages)} core site section pages verified successfully.")

# 4. Verify PWA Assets
assert os.path.exists("manifest.json"), "Missing manifest.json"
assert os.path.exists("service-worker.js"), "Missing service-worker.js"
assert os.path.exists("favicon.svg"), "Missing favicon.svg"
assert os.path.exists("assets/icon.svg"), "Missing assets/icon.svg"

with open("manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)
    assert manifest.get("name") == "أجواء | Ajwaa Weather", "Incorrect PWA app name"
    assert manifest.get("display") == "standalone", "PWA display must be standalone"

print("✓ PWA manifest and service worker configuration verified.")

print("\nAll verification tests passed with 100% success!")
