--
-- PostgreSQL database dump
--

\restrict eEuADgXw88Ca1dhdGtIFwxV8LvdmIZgYRCI9OfqYvcCu4Sz1r4hCQPaLnxgUoOw

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: batter_vs_pitcher; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.batter_vs_pitcher (
    id integer NOT NULL,
    match_id integer,
    batter_team_id integer,
    mlb_batter_id integer NOT NULL,
    mlb_pitcher_id integer NOT NULL,
    pitcher_name character varying(200),
    full_name character varying(200),
    ab integer,
    avg numeric(5,3),
    hr integer,
    rbi integer,
    ops numeric(5,3),
    k_pct numeric(5,2),
    season_from integer,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: batter_vs_pitcher_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.batter_vs_pitcher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: batter_vs_pitcher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.batter_vs_pitcher_id_seq OWNED BY public.batter_vs_pitcher.id;


--
-- Name: h2h_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.h2h_records (
    id integer NOT NULL,
    team_a_id integer,
    team_b_id integer,
    match_date date NOT NULL,
    score_a integer,
    score_b integer,
    league_id integer
);


--
-- Name: h2h_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.h2h_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: h2h_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.h2h_records_id_seq OWNED BY public.h2h_records.id;


--
-- Name: injuries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.injuries (
    id integer NOT NULL,
    player_id integer,
    team_id integer,
    injury_type character varying(200),
    status character varying(50),
    expected_return date,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: injuries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.injuries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: injuries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.injuries_id_seq OWNED BY public.injuries.id;


--
-- Name: leagues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leagues (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(50) NOT NULL,
    country character varying(50),
    sport character varying(50) NOT NULL,
    logo_url character varying(500),
    active boolean DEFAULT true
);


--
-- Name: leagues_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leagues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leagues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leagues_id_seq OWNED BY public.leagues.id;


--
-- Name: lineups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lineups (
    id integer NOT NULL,
    match_id integer,
    team_id integer,
    player_id integer,
    is_starter boolean DEFAULT true,
    position_order integer,
    minutes_projected numeric(4,1),
    status character varying(50) DEFAULT 'confirmed'::character varying
);


--
-- Name: lineups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lineups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lineups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lineups_id_seq OWNED BY public.lineups.id;


--
-- Name: matches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.matches (
    id integer NOT NULL,
    league_id integer,
    home_team_id integer,
    away_team_id integer,
    match_date timestamp with time zone NOT NULL,
    status character varying(50) DEFAULT 'scheduled'::character varying,
    home_score integer,
    away_score integer,
    venue character varying(200),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- Name: odds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.odds (
    id integer NOT NULL,
    match_id integer,
    sportsbook character varying(100) NOT NULL,
    bet_type character varying(50) NOT NULL,
    home_odds numeric(8,2),
    away_odds numeric(8,2),
    draw_odds numeric(8,2),
    spread_value numeric(5,2),
    total_value numeric(5,2),
    over_odds numeric(8,2),
    under_odds numeric(8,2),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: odds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.odds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: odds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.odds_id_seq OWNED BY public.odds.id;


--
-- Name: player_props; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_props (
    id integer NOT NULL,
    match_id integer,
    player_id integer,
    prop_type character varying(100) NOT NULL,
    line_value numeric(5,2),
    over_odds numeric(8,2),
    under_odds numeric(8,2),
    sportsbook character varying(100),
    hit_rate numeric(5,2),
    last_5_avg numeric(5,2),
    last_10_avg numeric(5,2),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: player_props_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.player_props_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: player_props_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.player_props_id_seq OWNED BY public.player_props.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.players (
    id integer NOT NULL,
    team_id integer,
    name character varying(200) NOT NULL,
    "position" character varying(50),
    number integer,
    photo_url character varying(500),
    status character varying(50) DEFAULT 'active'::character varying
);


--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: probable_pitchers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.probable_pitchers (
    id integer NOT NULL,
    match_id integer,
    team_id integer,
    mlb_player_id integer,
    full_name character varying(200),
    throws character(1),
    season_year integer,
    season_wins integer,
    season_losses integer,
    season_era numeric(5,2),
    season_ip numeric(6,1),
    season_hits_per9 numeric(5,2),
    season_k_per9 numeric(5,2),
    season_bb_per9 numeric(5,2),
    season_whip numeric(5,2),
    vs_wins integer,
    vs_losses integer,
    vs_era numeric(5,2),
    vs_ip numeric(6,1),
    vs_hits_per9 numeric(5,2),
    vs_k_per9 numeric(5,2),
    vs_bb_per9 numeric(5,2),
    vs_whip numeric(5,2)
);


--
-- Name: probable_pitchers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.probable_pitchers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: probable_pitchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.probable_pitchers_id_seq OWNED BY public.probable_pitchers.id;


--
-- Name: public_betting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.public_betting (
    id integer NOT NULL,
    match_id integer,
    bet_type character varying(50) NOT NULL,
    home_pct_bets numeric(5,2),
    away_pct_bets numeric(5,2),
    draw_pct_bets numeric(5,2),
    home_pct_money numeric(5,2),
    away_pct_money numeric(5,2),
    draw_pct_money numeric(5,2),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: public_betting_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.public_betting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: public_betting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.public_betting_id_seq OWNED BY public.public_betting.id;


--
-- Name: team_batters_splits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_batters_splits (
    team_id integer NOT NULL,
    mlb_player_id integer NOT NULL,
    full_name character varying(200),
    "position" character varying(10),
    bats character(1),
    season_year integer NOT NULL,
    season_ab integer,
    season_avg numeric(5,3),
    season_hr integer,
    season_rbi integer,
    season_ops numeric(5,3),
    season_k_pct numeric(5,2),
    vr_ab integer,
    vr_avg numeric(5,3),
    vr_hr integer,
    vr_rbi integer,
    vr_ops numeric(5,3),
    vr_k_pct numeric(5,2),
    vl_ab integer,
    vl_avg numeric(5,3),
    vl_hr integer,
    vl_rbi integer,
    vl_ops numeric(5,3),
    vl_k_pct numeric(5,2)
);


--
-- Name: team_games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_games (
    id integer NOT NULL,
    team_id integer,
    opponent_id integer,
    game_date date NOT NULL,
    is_home boolean,
    team_score integer,
    opponent_score integer,
    result character(1) NOT NULL,
    league_id integer
);


--
-- Name: team_games_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.team_games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: team_games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.team_games_id_seq OWNED BY public.team_games.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    league_id integer,
    name character varying(200) NOT NULL,
    short_name character varying(10),
    logo_url character varying(500),
    city character varying(100),
    conference character varying(100),
    division character varying(100),
    wins integer DEFAULT 0,
    losses integer DEFAULT 0,
    ties integer DEFAULT 0,
    win_pct numeric(4,3) DEFAULT 0.000,
    streak character varying(10) DEFAULT ''::character varying
);


--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: user_picks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_picks (
    id integer NOT NULL,
    user_id integer,
    match_id integer,
    pick_type character varying(50) NOT NULL,
    pick_value character varying(200) NOT NULL,
    odds numeric(8,2),
    sportsbook character varying(100),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_picks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_picks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_picks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_picks_id_seq OWNED BY public.user_picks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    name character varying(255),
    stripe_customer_id character varying(255),
    stripe_subscription_id character varying(255),
    status character varying(50) DEFAULT 'trial'::character varying,
    trial_ends_at timestamp without time zone,
    subscription_ends_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: batter_vs_pitcher id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batter_vs_pitcher ALTER COLUMN id SET DEFAULT nextval('public.batter_vs_pitcher_id_seq'::regclass);


--
-- Name: h2h_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.h2h_records ALTER COLUMN id SET DEFAULT nextval('public.h2h_records_id_seq'::regclass);


--
-- Name: injuries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.injuries ALTER COLUMN id SET DEFAULT nextval('public.injuries_id_seq'::regclass);


--
-- Name: leagues id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leagues ALTER COLUMN id SET DEFAULT nextval('public.leagues_id_seq'::regclass);


--
-- Name: lineups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lineups ALTER COLUMN id SET DEFAULT nextval('public.lineups_id_seq'::regclass);


--
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- Name: odds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.odds ALTER COLUMN id SET DEFAULT nextval('public.odds_id_seq'::regclass);


--
-- Name: player_props id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_props ALTER COLUMN id SET DEFAULT nextval('public.player_props_id_seq'::regclass);


--
-- Name: players id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- Name: probable_pitchers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.probable_pitchers ALTER COLUMN id SET DEFAULT nextval('public.probable_pitchers_id_seq'::regclass);


--
-- Name: public_betting id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.public_betting ALTER COLUMN id SET DEFAULT nextval('public.public_betting_id_seq'::regclass);


--
-- Name: team_games id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_games ALTER COLUMN id SET DEFAULT nextval('public.team_games_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: user_picks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_picks ALTER COLUMN id SET DEFAULT nextval('public.user_picks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: batter_vs_pitcher batter_vs_pitcher_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batter_vs_pitcher
    ADD CONSTRAINT batter_vs_pitcher_pkey PRIMARY KEY (id);


--
-- Name: h2h_records h2h_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.h2h_records
    ADD CONSTRAINT h2h_records_pkey PRIMARY KEY (id);


--
-- Name: injuries injuries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.injuries
    ADD CONSTRAINT injuries_pkey PRIMARY KEY (id);


--
-- Name: leagues leagues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leagues
    ADD CONSTRAINT leagues_pkey PRIMARY KEY (id);


--
-- Name: leagues leagues_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leagues
    ADD CONSTRAINT leagues_slug_key UNIQUE (slug);


--
-- Name: lineups lineups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lineups
    ADD CONSTRAINT lineups_pkey PRIMARY KEY (id);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: odds odds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.odds
    ADD CONSTRAINT odds_pkey PRIMARY KEY (id);


--
-- Name: player_props player_props_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_props
    ADD CONSTRAINT player_props_pkey PRIMARY KEY (id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: probable_pitchers probable_pitchers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.probable_pitchers
    ADD CONSTRAINT probable_pitchers_pkey PRIMARY KEY (id);


--
-- Name: public_betting public_betting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.public_betting
    ADD CONSTRAINT public_betting_pkey PRIMARY KEY (id);


--
-- Name: team_batters_splits team_batters_splits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_batters_splits
    ADD CONSTRAINT team_batters_splits_pkey PRIMARY KEY (team_id, mlb_player_id, season_year);


--
-- Name: team_games team_games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_games
    ADD CONSTRAINT team_games_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: user_picks user_picks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_picks
    ADD CONSTRAINT user_picks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_bvp_match; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bvp_match ON public.batter_vs_pitcher USING btree (match_id);


--
-- Name: idx_injuries_team; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_injuries_team ON public.injuries USING btree (team_id);


--
-- Name: idx_lineups_match; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lineups_match ON public.lineups USING btree (match_id);


--
-- Name: idx_matches_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_matches_date ON public.matches USING btree (match_date);


--
-- Name: idx_matches_league; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_matches_league ON public.matches USING btree (league_id);


--
-- Name: idx_odds_match; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_odds_match ON public.odds USING btree (match_id);


--
-- Name: idx_player_props_match; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_player_props_match ON public.player_props USING btree (match_id);


--
-- Name: idx_probable_pitchers_match; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_probable_pitchers_match ON public.probable_pitchers USING btree (match_id);


--
-- Name: idx_public_betting_match; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_public_betting_match ON public.public_betting USING btree (match_id);


--
-- Name: idx_team_batters_team; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_team_batters_team ON public.team_batters_splits USING btree (team_id);


--
-- Name: idx_team_games_team; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_team_games_team ON public.team_games USING btree (team_id);


--
-- Name: idx_user_picks_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_picks_user ON public.user_picks USING btree (user_id);


--
-- Name: batter_vs_pitcher batter_vs_pitcher_batter_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batter_vs_pitcher
    ADD CONSTRAINT batter_vs_pitcher_batter_team_id_fkey FOREIGN KEY (batter_team_id) REFERENCES public.teams(id);


--
-- Name: batter_vs_pitcher batter_vs_pitcher_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batter_vs_pitcher
    ADD CONSTRAINT batter_vs_pitcher_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id);


--
-- Name: h2h_records h2h_records_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.h2h_records
    ADD CONSTRAINT h2h_records_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id);


--
-- Name: h2h_records h2h_records_team_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.h2h_records
    ADD CONSTRAINT h2h_records_team_a_id_fkey FOREIGN KEY (team_a_id) REFERENCES public.teams(id);


--
-- Name: h2h_records h2h_records_team_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.h2h_records
    ADD CONSTRAINT h2h_records_team_b_id_fkey FOREIGN KEY (team_b_id) REFERENCES public.teams(id);


--
-- Name: injuries injuries_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.injuries
    ADD CONSTRAINT injuries_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: injuries injuries_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.injuries
    ADD CONSTRAINT injuries_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: lineups lineups_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lineups
    ADD CONSTRAINT lineups_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id);


--
-- Name: lineups lineups_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lineups
    ADD CONSTRAINT lineups_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: lineups lineups_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lineups
    ADD CONSTRAINT lineups_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: matches matches_away_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_away_team_id_fkey FOREIGN KEY (away_team_id) REFERENCES public.teams(id);


--
-- Name: matches matches_home_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_home_team_id_fkey FOREIGN KEY (home_team_id) REFERENCES public.teams(id);


--
-- Name: matches matches_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id);


--
-- Name: odds odds_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.odds
    ADD CONSTRAINT odds_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id);


--
-- Name: player_props player_props_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_props
    ADD CONSTRAINT player_props_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id);


--
-- Name: player_props player_props_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_props
    ADD CONSTRAINT player_props_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: players players_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: probable_pitchers probable_pitchers_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.probable_pitchers
    ADD CONSTRAINT probable_pitchers_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- Name: probable_pitchers probable_pitchers_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.probable_pitchers
    ADD CONSTRAINT probable_pitchers_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: public_betting public_betting_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.public_betting
    ADD CONSTRAINT public_betting_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id);


--
-- Name: team_batters_splits team_batters_splits_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_batters_splits
    ADD CONSTRAINT team_batters_splits_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: team_games team_games_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_games
    ADD CONSTRAINT team_games_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id);


--
-- Name: team_games team_games_opponent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_games
    ADD CONSTRAINT team_games_opponent_id_fkey FOREIGN KEY (opponent_id) REFERENCES public.teams(id);


--
-- Name: team_games team_games_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_games
    ADD CONSTRAINT team_games_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id);


--
-- Name: teams teams_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_league_id_fkey FOREIGN KEY (league_id) REFERENCES public.leagues(id);


--
-- Name: user_picks user_picks_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_picks
    ADD CONSTRAINT user_picks_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id);


--
-- Name: user_picks user_picks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_picks
    ADD CONSTRAINT user_picks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict eEuADgXw88Ca1dhdGtIFwxV8LvdmIZgYRCI9OfqYvcCu4Sz1r4hCQPaLnxgUoOw

