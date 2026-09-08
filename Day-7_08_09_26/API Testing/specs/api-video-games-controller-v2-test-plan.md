# Swagger UI API Test Plan - Video Games Controller V2

## Application Overview

API test plan for only the api-video-games-controller-v-2 Swagger operations at https://videogamedb.uk/swagger-ui/index.html#/api-video-games-controller-v-2. Covered endpoints are GET /api/v2/videogame, GET /api/v2/videogame/{id}, POST /api/v2/videogame, PUT /api/v2/videogame/{id}, and DELETE /api/v2/videogame/{id}. The service reports READ ONLY mode; POST returns a generated id of 0 and PUT/DELETE are authorization-protected in the observed environment. Expected results contain only status codes and response bodies.

## Test Scenarios

### 1. api-video-games-controller-v-2

**Seed:** `tests/seed.spec.ts`

#### 1.1. GET list returns all video games

**File:** `tests/api-video-games-controller-v2/get-list.spec.ts`

**Steps:**
  1. Send GET https://videogamedb.uk/api/v2/videogame with Accept: application/xml.
    - expect: Status code: 200
    - expect: Response body: <List><item category="Shooter"><id>1</id><name>Resident Evil 4</name><releaseDate>2005-10-01 23:59:59</releaseDate><reviewScore>85</reviewScore><rating>Universal</rating></item><item category="Driving"><id>2</id><name>Gran Turismo 3</name><releaseDate>2001-03-10 23:59:59</releaseDate><reviewScore>91</reviewScore><rating>Universal</rating></item><item category="Puzzle"><id>3</id><name>Tetris</name><releaseDate>1984-06-25 23:59:59</releaseDate><reviewScore>88</reviewScore><rating>Universal</rating></item><item category="Platform"><id>4</id><name>Super Mario 64</name><releaseDate>1996-10-20 23:59:59</releaseDate><reviewScore>90</reviewScore><rating>Universal</rating></item><item category="Adventure"><id>5</id><name>The Legend of Zelda: Ocarina of Time</name><releaseDate>1998-12-10 23:59:59</releaseDate><reviewScore>93</reviewScore><rating>PG-13</rating></item><item category="Shooter"><id>6</id><name>Doom</name><releaseDate>1993-02-18 23:59:59</releaseDate><reviewScore>81</reviewScore><rating>Mature</rating></item><item category="Puzzle"><id>7</id><name>Minecraft</name><releaseDate>2011-12-05 23:59:59</releaseDate><reviewScore>77</reviewScore><rating>Universal</rating></item><item category="Strategy"><id>8</id><name>SimCity 2000</name><releaseDate>1994-09-11 23:59:59</releaseDate><reviewScore>88</reviewScore><rating>Universal</rating></item><item category="RPG"><id>9</id><name>Final Fantasy VII</name><releaseDate>1997-08-20 23:59:59</releaseDate><reviewScore>97</reviewScore><rating>PG-13</rating></item><item category="Driving"><id>10</id><name>Grand Theft Auto III</name><releaseDate>2001-04-23 23:59:59</releaseDate><reviewScore>90</reviewScore><rating>Mature</rating></item></List>

#### 1.2. GET existing video game by ID

**File:** `tests/api-video-games-controller-v2/get-by-id.spec.ts`

**Steps:**
  1. Send GET https://videogamedb.uk/api/v2/videogame/1 with Accept: application/xml.
    - expect: Status code: 200
    - expect: Response body: <VideoGame category="Shooter"><id>1</id><name>Resident Evil 4</name><releaseDate>2005-10-01 23:59:59</releaseDate><reviewScore>85</reviewScore><rating>Universal</rating></VideoGame>

#### 1.3. GET nonexistent video game returns not found

**File:** `tests/api-video-games-controller-v2/get-nonexistent.spec.ts`

**Steps:**
  1. Send GET https://videogamedb.uk/api/v2/videogame/9999 with Accept: application/xml.
    - expect: Status code: 404
    - expect: Response body: <!doctype html><html lang="en"><head><title>HTTP Status 404 – Not Found</title><style type="text/css">body {font-family:Tahoma,Arial,sans-serif;} h1, h2, h3, b {color:white;background-color:#525D76;} h1 {font-size:22px;} h2 {font-size:16px;} h3 {font-size:12px;} p {font-size:12px;} a {color:black;} .line {height:1px;background-color:#525D76;border:none;}</style></head><body><h1>HTTP Status 404 – Not Found</h1></body></html>

#### 1.4. POST creates a video game in read-only mode

**File:** `tests/api-video-games-controller-v2/post-create.spec.ts`

**Steps:**
  1. Send POST https://videogamedb.uk/api/v2/videogame with Content-Type: application/json, Accept: application/xml, and body { "category": "Platform", "name": "Copilot QA 2026-09-08", "rating": "Mature", "releaseDate": "2026-09-08", "reviewScore": 85 }.
    - expect: Status code: 200
    - expect: Response body: <VideoGame category="Platform"><id>0</id><name>Copilot QA 2026-09-08</name><releaseDate>2026-09-08</releaseDate><reviewScore>85</reviewScore><rating>Mature</rating></VideoGame>

#### 1.5. PUT existing video game is rejected without authorization

**File:** `tests/api-video-games-controller-v2/put-update-unauthorized.spec.ts`

**Steps:**
  1. Send PUT https://videogamedb.uk/api/v2/videogame/1 with Content-Type: application/json, Accept: application/xml, and body { "category": "Shooter", "name": "Resident Evil 4 Updated", "rating": "Universal", "releaseDate": "2005-10-01", "reviewScore": 86 }.
    - expect: Status code: 403
    - expect: Response body: empty

#### 1.6. DELETE existing video game is rejected without authorization

**File:** `tests/api-video-games-controller-v2/delete-unauthorized.spec.ts`

**Steps:**
  1. Send DELETE https://videogamedb.uk/api/v2/videogame/1 with Accept: text/plain.
    - expect: Status code: 403
    - expect: Response body: empty
