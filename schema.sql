--
-- PostgreSQL database dump
--

CREATE TABLE link_messages (
    id serial PRIMARY KEY,
    -- ts timestamp without time zone,
    links text[] NOT NULL,
    message text NOT NULL
);
