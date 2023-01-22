MATCH (n)
DETACH DELETE (n);

CALL apoc.schema.assert({ }, {}, true ) YIELD label, key
RETURN *;

CREATE
(p1:Person { Id:"p1", Name:"Andrija", Email:"andonnet@gmail.com" }),
(p2:Person { Id:"p2", Name:"Boban", Email:"boban@gmail.com" }),
(p3:Person { Id:"p3", Name:"Dragan", Email:"dragan@gmail.com" }),
(p4:Person { Id:"p4", Name:"Miroslav", Email:"mile@gmail.com" }),
(p5:Person { Id:"p5", Name:"Džošua", Email:"jaydawg@gmail.com" }),
(p6:Person { Id:"p6", Name:"Milan", Email:"milance@gmail.com" }),

(p1)-[:FRIENDS_WITH]->(p2),
(p2)-[:FRIENDS_WITH]->(p1),
(p3)-[:FRIENDS_WITH]->(p6),
(p3)-[:FRIENDS_WITH]->(p1),
(p3)-[:FRIENDS_WITH]->(p4),


(city1:City { Id:"city1", Name:"Nis" }),
(city2:City { Id:"city2", Name:"Pirot" }),
(city2:City { Id:"city3", Name:"Beograd" }),
(city2:City { Id:"city4", Name:"Indjija" }),
(city2:City { Id:"city5", Name:"Zlatibor" }),


(p1)-[:LOCATED_IN]->(city1),
(p2)-[:LOCATED_IN]->(city1),
(p3)-[:LOCATED_IN]->(city1),
(p4)-[:LOCATED_IN]->(city2),
(p5)-[:LOCATED_IN]->(city2),
(p6)-[:LOCATED_IN]->(city1),


(g1:Gym:Place {Id:"g1", Name:"Gym Town 2", Address:"Kralja Milutina", OpeningHours: [
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00")
],

ClosingHours: [
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00")
], MembershipPrice:3000, Location: point({ longitude: 43.3221259, latitude: 21.9039922 }) }),

(g2:Gym:Place {Id:"g2", Name:"Gym Town 1", Address:"Kralja Milutina", OpeningHours: [
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00")
],

ClosingHours: [
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00")
], MembershipPrice:2000, Location: point({ longitude: 43.3136322, latitude: 21.8868664 }) }),

(h1:Hotel:Place {Id:"h1", Name:"Hotel Ambasador", Address:"Kralja Vukasina", OpeningHours: [
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00")
],

ClosingHours: [
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00")
], Stars:2, Location: point({ longitude: 43.3210154, latitude: 21.8944261 }) }),

(rest1:Restaurant:Place {Id:"rest1", Name:"Pleasure", Address:"Kralja Milana", OpeningHours: [
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00")
],

ClosingHours: [
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00")
],
FoodTypes:["Chinese", "Italian"], HasTakeout: true , Location: point({ longitude: 43.3172983, latitude: 21.9047123 }) }),

(c1:Cinema:Place { Id:"c1", Name:"Vilin Grad", Address:"Stojana Novakovica",

OpeningHours: [
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00")
],

ClosingHours: [
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00")
], Location: point({ longitude: 43.319012, latitude: 21.8928478 }) }),

(c1:Cinema:Place { Id:"c2", Name:"Cine Grand", Address:"Bulevar Nemanjica",

OpeningHours: [
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00"),
time("8:00")
],

ClosingHours: [
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00"),
time("23:00")
], Location: point({ longitude: 43.3191666, latitude: 21.8929323 }) }),



(g1)-[:LOCATED_IN]->(city1),
(g2)-[:LOCATED_IN]->(city1),

(h1)-[:LOCATED_IN]->(city1),

(rest1)-[:LOCATED_IN]->(city1),

(c1)-[:LOCATED_IN]->(city1),
(c2)-[:LOCATED_IN]->(city1),

(p1)-[:REVIEWED { PersonId: "p1", PlaceId: "c1", Rating: 5, Comment: "My pleasure" }]->(c1);

CREATE POINT INDEX place_location_index
FOR (pl:Place) ON (pl.Location);

CREATE FULLTEXT INDEX place_name_index
FOR (pl:Place) ON EACH [pl.Name];

CREATE FULLTEXT INDEX person_name_index
FOR (p:Person) ON EACH [p.Name];
