import os
import sys
import json
import re

print("Running Comprehensive Verification Test Suite for 'Weather Today | الطقس اليوم'...")

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
        assert "الطقس اليوم" in content or "Weather Today" in content, f"Missing Weather Today branding in {html_path}"

print("✓ All 69 standalone wilaya pages exist, have valid HTML, Schema.org LD+JSON, and SEO tags.")

# 2. Verify Arab Capitals
capitals_file = "data/arab-capitals.json"
assert os.path.exists(capitals_file), "Missing data/arab-capitals.json"
with open(capitals_file, "r", encoding="utf-8") as f:
    capitals = json.load(f)
assert len(capitals) == 22, f"Expected 22 Arab capitals, got {len(capitals)}"
print(f"✓ Confirmed exactly 22 Arab capitals in {capitals_file}")

# 2b. Verify the global capitals directory dataset
world_file = "data/world-capitals.json"
assert os.path.exists(world_file), "Missing data/world-capitals.json"
with open(world_file, "r", encoding="utf-8") as f:
    world_capitals = json.load(f)
assert len(world_capitals) >= 100, f"Expected a broad global capitals dataset, got {len(world_capitals)}"
assert {row["continent"] for row in world_capitals} == {"africa", "europe", "america", "asia"}
assert len({row["slug"] for row in world_capitals}) == len(world_capitals), "Duplicate global capital slugs"
for row in world_capitals:
    assert row["country"] and row["capital"] and row["englishName"] and row["countryCode"]
    assert -90 <= row["latitude"] <= 90 and -180 <= row["longitude"] <= 180
print(f"✓ Confirmed {len(world_capitals)} global capitals across four continents.")


# 3. Verify Key Pages
key_pages = [
    "index.html",
    "wilayas/index.html",
    "arab-capitals/index.html",
    "world-capitals/index.html",
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
        assert "الطقس اليوم" in content or "Weather Today" in content, f"Missing Weather Today branding in {page}"
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
    assert manifest.get("name") == "Weather Today | الطقس اليوم", "Incorrect PWA app name"
    assert manifest.get("display") == "standalone", "PWA display must be standalone"

print("✓ PWA manifest and service worker configuration verified.")

# 5. Verify project URL, SEO discovery files, and homepage runtime hooks
with open("index.html", "r", encoding="utf-8") as f:
    home = f.read()
    assert "Weather Today | الطقس اليوم" in home
    assert 'id="active-city-title"' in home
    assert 'id="current-city-label"' in home
    assert 'id="insight-grid"' in home
    assert 'id="location-quick"' in home
    assert "https://imadtbn.github.io/weather-today/" in home
    assert "world-capitals" in home


assert os.path.exists("sitemap.xml"), "Missing sitemap.xml"
assert os.path.exists("robots.txt"), "Missing robots.txt"
with open("sitemap.xml", "r", encoding="utf-8") as f:
    sitemap = f.read()
    assert "https://imadtbn.github.io/weather-today/" in sitemap
    assert "https://imadtbn.github.io/weather-today/world-capitals/" in sitemap
    assert sitemap.count("<url>") >= 80, "Sitemap does not include all key and city pages"
with open("robots.txt", "r", encoding="utf-8") as f:
    robots = f.read()
    assert "Sitemap: https://imadtbn.github.io/weather-today/sitemap.xml" in robots

with open("service-worker.js", "r", encoding="utf-8") as f:
    worker = f.read()
    assert 'key.startsWith(CACHE_PREFIX)' in worker
    assert 'weather-today-cache-' in worker
    assert '"./data/world-capitals.json"' in worker
print("✓ Weather Today branding, GitHub Pages SEO, sitemap, robots, and scoped cache checks passed.")
print("\nAll verification tests passed with 100% success!")
