--
-- PostgreSQL database dump
--

CREATE TABLE link_messages (
    ts timestamp without time zone PRIMARY KEY,
    uuid uuid NOT NULL UNIQUE,
    type text NOT NULL,
    facts text NOT NULL
);
