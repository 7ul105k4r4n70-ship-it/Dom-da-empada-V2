--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.tenants (id, name, external_id, jwt_secret, max_concurrent_users, inserted_at, updated_at, max_events_per_second, postgres_cdc_default, max_bytes_per_second, max_channels_per_client, max_joins_per_second, suspend, jwt_jwks, notify_private_alpha, private_only, migrations_ran, broadcast_adapter, max_presence_events_per_second, max_payload_size_in_kb, max_client_presence_events_per_window, client_presence_window_ms) FROM stdin;
40c0baa1-cf44-4556-bdb2-370c99803a8b	realtime-dev	realtime-dev	g4c6iBgzysFOS7qFtn1zZSe2u71hMPpTtwKm4jm7/N+DiPB2muojc8hEe7UFK2O0	200	2026-04-18 17:59:02	2026-04-18 17:59:02	100	postgres_cdc_rls	100000	100	100	f	\N	f	f	67	gen_rpc	1000	3000	\N	\N
\.


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.extensions (id, type, settings, tenant_external_id, inserted_at, updated_at) FROM stdin;
f691ad21-53b1-4b54-b1b6-f4635c662c56	postgres_cdc_rls	{"region": "us-east-1", "db_host": "QhixI0o7PYIABziLUL4f0A==", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "eGxa2ZKVreSn7eWieRQdp74vN25K+qFgdnxmDCKe4p20+C0410WXonzXTEj9CgYx", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}	realtime-dev	2026-04-18 17:59:02	2026-04-18 17:59:02
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.schema_migrations (version, inserted_at) FROM stdin;
20210706140551	2026-04-10 11:29:24
20220329161857	2026-04-10 11:29:24
20220410212326	2026-04-10 11:29:24
20220506102948	2026-04-10 11:29:24
20220527210857	2026-04-10 11:29:24
20220815211129	2026-04-10 11:29:24
20220815215024	2026-04-10 11:29:24
20220818141501	2026-04-10 11:29:24
20221018173709	2026-04-10 11:29:24
20221102172703	2026-04-10 11:29:24
20221223010058	2026-04-10 11:29:24
20230110180046	2026-04-10 11:29:24
20230810220907	2026-04-10 11:29:25
20230810220924	2026-04-10 11:29:25
20231024094642	2026-04-10 11:29:25
20240306114423	2026-04-10 11:29:25
20240418082835	2026-04-10 11:29:25
20240625211759	2026-04-10 11:29:25
20240704172020	2026-04-10 11:29:25
20240902173232	2026-04-10 11:29:25
20241106103258	2026-04-10 11:29:25
20250424203323	2026-04-10 11:29:25
20250613072131	2026-04-10 11:29:25
20250711044927	2026-04-10 11:29:25
20250811121559	2026-04-10 11:29:25
20250926223044	2026-04-10 11:29:25
20251204170944	2026-04-10 11:29:25
20251218000543	2026-04-10 11:29:25
20260209232800	2026-04-10 11:29:25
\.


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	71f91d12-d009-404e-ba24-e162e0857a16	{"action":"user_signedup","actor_id":"133a637a-a219-4d1e-8596-424151e76fc9","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 12:40:37.082056+00	
00000000-0000-0000-0000-000000000000	31884c4a-430e-4a73-a0c9-a7040bc7c2c2	{"action":"login","actor_id":"133a637a-a219-4d1e-8596-424151e76fc9","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 12:40:37.101945+00	
00000000-0000-0000-0000-000000000000	9143995b-1523-451c-abbd-2bfb406f6546	{"action":"login","actor_id":"133a637a-a219-4d1e-8596-424151e76fc9","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 12:45:16.563243+00	
00000000-0000-0000-0000-000000000000	a302b28d-062a-46b7-9698-e33210b6c4ab	{"action":"user_repeated_signup","actor_id":"133a637a-a219-4d1e-8596-424151e76fc9","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-10 13:04:47.610073+00	
00000000-0000-0000-0000-000000000000	407872a0-c186-478e-b921-3e73e501d441	{"action":"user_signedup","actor_id":"319e8db9-842e-4148-bc02-9f36ec30ed3b","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 13:18:05.949489+00	
00000000-0000-0000-0000-000000000000	800c4cd0-faa8-4546-b950-986b24e275a8	{"action":"login","actor_id":"319e8db9-842e-4148-bc02-9f36ec30ed3b","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 13:18:05.979429+00	
00000000-0000-0000-0000-000000000000	c4e856eb-c90e-468c-bd8e-56ad4de257e1	{"action":"login","actor_id":"319e8db9-842e-4148-bc02-9f36ec30ed3b","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 13:20:54.856356+00	
00000000-0000-0000-0000-000000000000	70e97f29-dedf-4394-a7f2-f2fbcdf83e38	{"action":"user_signedup","actor_id":"fe2a7d55-daaa-40d1-ac3a-1bba825ec5b1","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 13:30:35.820641+00	
00000000-0000-0000-0000-000000000000	64067bb7-6425-41dc-b2b5-8ada1956794a	{"action":"login","actor_id":"fe2a7d55-daaa-40d1-ac3a-1bba825ec5b1","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 13:30:35.84263+00	
00000000-0000-0000-0000-000000000000	f7c32a33-dfc8-4f8b-a1ee-9ef0906bae52	{"action":"user_repeated_signup","actor_id":"fe2a7d55-daaa-40d1-ac3a-1bba825ec5b1","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-10 13:31:36.72434+00	
00000000-0000-0000-0000-000000000000	e6268e09-8b63-4b99-8b6e-0d2ece5ffee7	{"action":"user_signedup","actor_id":"97b3a07c-ea1c-49e3-a159-eab1e303f30e","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 13:34:33.776722+00	
00000000-0000-0000-0000-000000000000	8237e3cc-3d81-4f38-9f67-79a1b8ec4746	{"action":"login","actor_id":"97b3a07c-ea1c-49e3-a159-eab1e303f30e","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 13:34:33.804+00	
00000000-0000-0000-0000-000000000000	0ddaca60-a9bc-4227-b576-766e5b778a62	{"action":"user_signedup","actor_id":"5e5e2f1c-1097-4ac0-9be4-5c300c90a0fe","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 13:42:46.005365+00	
00000000-0000-0000-0000-000000000000	692febe2-f2d1-4403-8818-6768cc2f0d68	{"action":"login","actor_id":"5e5e2f1c-1097-4ac0-9be4-5c300c90a0fe","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 13:42:46.027485+00	
00000000-0000-0000-0000-000000000000	79ee43a7-b15d-4102-99db-0c255e916740	{"action":"user_signedup","actor_id":"7889d8b3-fd22-4419-ab70-1a499289bf06","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 14:13:06.413123+00	
00000000-0000-0000-0000-000000000000	8330fd6c-3559-4f7b-9e0f-eadd4962cb81	{"action":"login","actor_id":"7889d8b3-fd22-4419-ab70-1a499289bf06","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 14:13:06.439379+00	
00000000-0000-0000-0000-000000000000	0f85eef0-1c92-4d78-a924-aeff2ac58b54	{"action":"user_signedup","actor_id":"6c95ef81-ca7e-4a62-a364-45b6c912a33e","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 14:20:40.427914+00	
00000000-0000-0000-0000-000000000000	804dd92b-4f47-42ce-85be-2b6888d94bb5	{"action":"login","actor_id":"6c95ef81-ca7e-4a62-a364-45b6c912a33e","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 14:20:40.447652+00	
00000000-0000-0000-0000-000000000000	6041478a-86f2-47fe-b0a5-ca3389e55763	{"action":"user_signedup","actor_id":"3041dbef-9dc6-45af-a81e-dd1c84d726f7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 14:44:32.833158+00	
00000000-0000-0000-0000-000000000000	61a8115d-ef25-4c90-b72b-1ec29c896b78	{"action":"login","actor_id":"3041dbef-9dc6-45af-a81e-dd1c84d726f7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 14:44:32.851096+00	
00000000-0000-0000-0000-000000000000	d1811b84-af69-4940-b4b1-acc46e4ac877	{"action":"user_signedup","actor_id":"1b66dcba-7df7-4e14-bf57-325c459afba0","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 15:19:52.018319+00	
00000000-0000-0000-0000-000000000000	79b8c3c4-adc2-4a92-8d94-d0df43284e43	{"action":"login","actor_id":"1b66dcba-7df7-4e14-bf57-325c459afba0","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 15:19:52.034843+00	
00000000-0000-0000-0000-000000000000	c2c2b2fd-8868-4539-86fa-8883f88bbec3	{"action":"login","actor_id":"1b66dcba-7df7-4e14-bf57-325c459afba0","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 15:20:08.622543+00	
00000000-0000-0000-0000-000000000000	004c1e73-527c-4249-ab69-81f9e1823c85	{"action":"login","actor_id":"1b66dcba-7df7-4e14-bf57-325c459afba0","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 15:21:45.636469+00	
00000000-0000-0000-0000-000000000000	69a5896b-52f5-4a9b-82fd-d66bb68ff90a	{"action":"login","actor_id":"1b66dcba-7df7-4e14-bf57-325c459afba0","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 15:21:53.693124+00	
00000000-0000-0000-0000-000000000000	341ae45a-f79e-430b-9d99-0ae47d91bfe1	{"action":"login","actor_id":"1b66dcba-7df7-4e14-bf57-325c459afba0","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 15:46:20.989695+00	
00000000-0000-0000-0000-000000000000	db2b8c19-1549-4516-b20a-af215be337f2	{"action":"user_signedup","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 17:43:36.325083+00	
00000000-0000-0000-0000-000000000000	543e32ae-84ab-4bf6-8579-9ad2fa7c6752	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 17:43:36.353551+00	
00000000-0000-0000-0000-000000000000	22a7a8f4-318d-4fe6-bb38-233fc7046c75	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 17:44:19.944644+00	
00000000-0000-0000-0000-000000000000	37e92296-9c52-4e54-a9c1-06cdfb6c5dd8	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 17:46:34.7897+00	
00000000-0000-0000-0000-000000000000	09c1f7c9-3aa1-4a07-bd41-b2ee623dcca0	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 17:58:39.888924+00	
00000000-0000-0000-0000-000000000000	b7229899-fdbb-44df-859f-5c85b24453fb	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 18:23:16.712112+00	
00000000-0000-0000-0000-000000000000	7ecef13b-5579-447d-a8e5-661e1b0b55df	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 18:43:28.793948+00	
00000000-0000-0000-0000-000000000000	4d20b2bc-f519-4882-a058-a318eb0ece16	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 18:46:01.044751+00	
00000000-0000-0000-0000-000000000000	d375bec8-269a-42b8-91be-6c71eb7a004e	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 18:48:47.404536+00	
00000000-0000-0000-0000-000000000000	3d2eecec-2844-42e5-a798-8df708b2fdb6	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 18:50:48.198265+00	
00000000-0000-0000-0000-000000000000	4a9d8b4b-cf46-4df4-9344-b7c96e352ae7	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 18:52:09.338897+00	
00000000-0000-0000-0000-000000000000	a866899c-58a2-4330-90fe-9c7054d3b36a	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 18:55:14.93193+00	
00000000-0000-0000-0000-000000000000	db474061-cfc6-4ee3-9144-427995cdc5dd	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:04:54.986262+00	
00000000-0000-0000-0000-000000000000	3a6bd1cb-7cfb-4bd3-bef8-82888a07361e	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:08:20.887472+00	
00000000-0000-0000-0000-000000000000	4251f076-4029-496b-8d73-1a3633020c1e	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:09:59.345387+00	
00000000-0000-0000-0000-000000000000	ff4ff8ba-acf6-4a5d-8988-97e348f42963	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:11:42.425992+00	
00000000-0000-0000-0000-000000000000	7d8a22fc-9e4c-49c2-81d4-4cbf18114efc	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:12:21.575639+00	
00000000-0000-0000-0000-000000000000	130064c6-1f79-43c6-9d08-01b66b3de7c3	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:13:10.540481+00	
00000000-0000-0000-0000-000000000000	1512a243-327c-40d8-bbf1-90f10615a6a0	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:14:07.640688+00	
00000000-0000-0000-0000-000000000000	94a47e0d-1818-405c-9786-907d60bbe599	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:16:11.801422+00	
00000000-0000-0000-0000-000000000000	f3ed7df5-9a90-4cac-b671-512b9c396f48	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:19:55.514274+00	
00000000-0000-0000-0000-000000000000	85405bbb-4f7b-436f-b9e7-014b0d948614	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:21:12.212533+00	
00000000-0000-0000-0000-000000000000	ce6394ea-7930-4d5c-b100-69cb40739111	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:29:00.264518+00	
00000000-0000-0000-0000-000000000000	f39c9614-ddde-4854-8a9c-58fcc53c783d	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:31:41.562401+00	
00000000-0000-0000-0000-000000000000	8fbd7f5a-77ce-40b2-8104-b632e9b97d0f	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:37:58.897819+00	
00000000-0000-0000-0000-000000000000	7a2c3874-830a-4188-97d0-36fa077138c3	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:40:03.694666+00	
00000000-0000-0000-0000-000000000000	72eec57b-b1b2-43af-9ba4-64c97b76af50	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:43:22.108941+00	
00000000-0000-0000-0000-000000000000	cc1bc5e0-84a6-462f-9f7a-7d2aacf73bd8	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:48:51.636011+00	
00000000-0000-0000-0000-000000000000	51f6d029-afba-43fb-a3ec-3c0d3b3090eb	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:52:57.160503+00	
00000000-0000-0000-0000-000000000000	5b965566-f5aa-4a9a-a1a9-2558656072b6	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:54:58.55824+00	
00000000-0000-0000-0000-000000000000	de49c059-f407-4dc4-98df-4ff9692233a4	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:55:38.933397+00	
00000000-0000-0000-0000-000000000000	4163d98e-59f8-46f8-834a-fb2ee189048c	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:57:45.724946+00	
00000000-0000-0000-0000-000000000000	f4a1a497-c06b-4d9f-85e1-9cf1815c17e2	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 19:58:43.141616+00	
00000000-0000-0000-0000-000000000000	1ffdbb9d-cbee-47f5-a326-03c5336ae0c0	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 20:00:33.966675+00	
00000000-0000-0000-0000-000000000000	1f069b5a-bc00-49a3-90ba-40478b39219d	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 20:03:42.120885+00	
00000000-0000-0000-0000-000000000000	25d0508d-208b-4811-868f-2cf6f2d8c733	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 20:45:33.701347+00	
00000000-0000-0000-0000-000000000000	16e2719a-441e-445f-b5b3-41d4635d1b8a	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 20:50:30.787647+00	
00000000-0000-0000-0000-000000000000	08a69105-2ffd-4c5e-8c35-6fa7b751910f	{"action":"token_refreshed","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-10 21:52:59.92245+00	
00000000-0000-0000-0000-000000000000	fbe1de83-9925-4f73-acb6-f949ece6bd67	{"action":"token_revoked","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-10 21:52:59.924629+00	
00000000-0000-0000-0000-000000000000	3e62df1a-e3f5-4c71-99c7-aa1f16218ee0	{"action":"login","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 22:13:56.709036+00	
00000000-0000-0000-0000-000000000000	8ab9a3d8-20f3-4207-a2f4-788e757cb6f8	{"action":"user_repeated_signup","actor_id":"cf8d8cac-2163-4d6d-a9d8-296a9cdfd153","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-10 23:43:28.657589+00	
00000000-0000-0000-0000-000000000000	d9bb6402-37ad-466c-aca9-fa2784478f55	{"action":"user_signedup","actor_id":"a95ae4d5-c783-4dc0-a84c-ec24d81f8a93","actor_username":"7ul10sk4r4n70@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 23:44:04.306064+00	
00000000-0000-0000-0000-000000000000	cb52f62d-9fbe-4612-81eb-fb9ad79f50a9	{"action":"login","actor_id":"a95ae4d5-c783-4dc0-a84c-ec24d81f8a93","actor_username":"7ul10sk4r4n70@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 23:44:04.334999+00	
00000000-0000-0000-0000-000000000000	94cb5e85-6774-4f12-a09d-36a8eccb3f58	{"action":"user_signedup","actor_id":"4537eaee-f2e0-408e-8f2c-b7846defb431","actor_username":"tulioscaranto@outlook.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-04-10 23:49:42.583577+00	
00000000-0000-0000-0000-000000000000	43189b8c-f7cf-4717-8a96-57fe437a6826	{"action":"login","actor_id":"4537eaee-f2e0-408e-8f2c-b7846defb431","actor_username":"tulioscaranto@outlook.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-10 23:49:42.599726+00	
00000000-0000-0000-0000-000000000000	0fa09d8b-1707-4e61-9e0d-310603aacbea	{"action":"user_repeated_signup","actor_id":"4537eaee-f2e0-408e-8f2c-b7846defb431","actor_username":"tulioscaranto@outlook.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-10 23:49:51.771442+00	
00000000-0000-0000-0000-000000000000	fa716948-e9b7-41e6-8dd1-85314d3628f4	{"action":"user_confirmation_requested","actor_id":"0cf2ea73-bf35-4b66-9c20-4762124172cd","actor_username":"tulioscaranto@outlook.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 01:11:32.177489+00	
00000000-0000-0000-0000-000000000000	cf41faf2-f971-4a7b-ac10-8e312e2bf826	{"action":"user_confirmation_requested","actor_id":"0cf2ea73-bf35-4b66-9c20-4762124172cd","actor_username":"tulioscaranto@outlook.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 01:16:36.232233+00	
00000000-0000-0000-0000-000000000000	6b45f708-8858-4717-9d3c-1cddd9649ea6	{"action":"user_confirmation_requested","actor_id":"0cf2ea73-bf35-4b66-9c20-4762124172cd","actor_username":"tulioscaranto@outlook.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 01:19:10.3289+00	
00000000-0000-0000-0000-000000000000	60843524-c7a5-4375-9d15-292a5e81808f	{"action":"user_confirmation_requested","actor_id":"4e54f021-4203-4993-82dd-9e7ab51b2e5f","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 01:24:40.779412+00	
00000000-0000-0000-0000-000000000000	95d314d0-98bc-48e0-8bc0-7678e7b8aa73	{"action":"user_confirmation_requested","actor_id":"1dfe5ccd-e300-41c2-bb9b-b422a42d1213","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 01:59:09.497494+00	
00000000-0000-0000-0000-000000000000	efba79ca-020d-4eed-923b-65715fcb6803	{"action":"user_confirmation_requested","actor_id":"57781ace-6bc1-4a65-99b7-d137964b5a41","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 13:36:48.967558+00	
00000000-0000-0000-0000-000000000000	fab00351-d541-4a6a-aea0-43ac8f689650	{"action":"user_confirmation_requested","actor_id":"6b7c650d-8bb7-4f39-9737-7f3db7ba34e4","actor_username":"7ul105k4r4n70@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 13:37:40.528054+00	
00000000-0000-0000-0000-000000000000	65cb965b-d89b-4e73-b50c-ba72baf56586	{"action":"user_confirmation_requested","actor_id":"35e98226-3cad-498a-aeba-4a85c311d438","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 14:08:20.907846+00	
00000000-0000-0000-0000-000000000000	8fe9333d-0e86-468e-8c37-7ad3fadc7591	{"action":"user_recovery_requested","actor_id":"35e98226-3cad-498a-aeba-4a85c311d438","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user"}	2026-04-11 14:15:27.568039+00	
00000000-0000-0000-0000-000000000000	b4c37a27-c9e0-4c2b-91d9-30bce8a032d4	{"action":"user_confirmation_requested","actor_id":"35e98226-3cad-498a-aeba-4a85c311d438","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 14:15:57.720923+00	
00000000-0000-0000-0000-000000000000	5c4a6cd1-9482-4d32-8d63-1cdd7e8b871d	{"action":"user_confirmation_requested","actor_id":"c02c5696-5f7f-4060-9299-85c6662267c3","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 14:18:57.608488+00	
00000000-0000-0000-0000-000000000000	0c0713d4-671a-4c9a-9bad-f5c2d8dce104	{"action":"user_confirmation_requested","actor_id":"9ceac2e3-1fa6-467c-8508-d8658f8cbc87","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 14:32:05.623813+00	
00000000-0000-0000-0000-000000000000	96f8cf92-5d7a-463a-a954-bf51a330b893	{"action":"user_confirmation_requested","actor_id":"318ab112-38a7-46d8-951b-8bc8777d6921","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 15:11:43.759893+00	
00000000-0000-0000-0000-000000000000	07b0fd7c-0c7b-452f-b4ff-6d070e8fa6f0	{"action":"user_confirmation_requested","actor_id":"27a68b43-24e5-44b8-83a5-5a8bb0f442a5","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 15:17:47.670464+00	
00000000-0000-0000-0000-000000000000	fac06c62-5948-49e0-8bbb-7dabcd40575f	{"action":"user_confirmation_requested","actor_id":"b0785b15-177b-4f91-ad35-ab9c546c8498","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 15:30:46.590249+00	
00000000-0000-0000-0000-000000000000	3929406f-654c-468b-bb37-d8df39d08e32	{"action":"user_confirmation_requested","actor_id":"b420a214-66b5-4f61-93ae-ab0e057064f4","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 15:38:24.664734+00	
00000000-0000-0000-0000-000000000000	92eb526d-0cc5-47e1-96b8-a1f709b7b028	{"action":"user_confirmation_requested","actor_id":"4e241a5b-dc33-461d-89e5-d94c18aed348","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 15:53:13.737665+00	
00000000-0000-0000-0000-000000000000	06f6d42c-e4c1-4048-818d-d35473df75d1	{"action":"user_confirmation_requested","actor_id":"42c6cedd-e7a8-4a4c-8c3e-26be718db4af","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 16:04:48.264157+00	
00000000-0000-0000-0000-000000000000	e6449778-198d-4b77-8576-45b115dcee2c	{"action":"user_confirmation_requested","actor_id":"6fc25508-8978-41fa-bfe4-040a4cae9aa4","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 16:21:44.116795+00	
00000000-0000-0000-0000-000000000000	b752f98b-44c7-4ad5-a0fc-39830bf0f269	{"action":"user_confirmation_requested","actor_id":"09577933-79d0-4226-877e-07b35b7ca69b","actor_username":"tulioscaranto@outlook.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-11 22:39:25.639651+00	
00000000-0000-0000-0000-000000000000	6e2da531-9751-458a-92ba-4a8d4eacb846	{"action":"user_confirmation_requested","actor_id":"cf436e45-6407-4961-bc68-1df147999312","actor_username":"contato@domdaempada.com.br","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-12 00:03:49.239474+00	
00000000-0000-0000-0000-000000000000	7e2d397f-37b7-4615-83d8-db4ab99ccefb	{"action":"user_confirmation_requested","actor_id":"f3548311-aaaf-4178-81a8-0aab42eabf4b","actor_username":"tulio.r.scaranto@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-12 00:12:44.724976+00	
00000000-0000-0000-0000-000000000000	d7eb7481-1408-4e10-b505-2c468ef5913b	{"action":"user_confirmation_requested","actor_id":"b083d1f4-9c01-4ef4-af08-308a5cd0e732","actor_username":"tulioscaranto.1776123361144@franquia.domempada.app","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-13 23:36:01.770754+00	
00000000-0000-0000-0000-000000000000	ae4d6ee5-4ab3-4865-bf00-359a7d4298f3	{"action":"user_confirmation_requested","actor_id":"28155778-698e-494d-9b06-59d64b929dc8","actor_username":"tulioscaranto.1776123734228@franquia.domempada.app","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-13 23:42:14.678416+00	
00000000-0000-0000-0000-000000000000	36f9fb01-fe7d-4ec5-9698-7974194b50c6	{"action":"user_confirmation_requested","actor_id":"7f2f6e2d-63ef-4226-b0d6-ac34abea2d81","actor_username":"tulioscaranto.1776123817306@franquia.domempada.app","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-13 23:43:37.686482+00	
00000000-0000-0000-0000-000000000000	96b17626-0faa-4d3a-aa73-0156564cd1f8	{"action":"user_confirmation_requested","actor_id":"858c36c5-c84a-4a10-8f0c-74af4fcc1985","actor_username":"tulioscaranto.1776123940359@franquia.domempada.app","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-13 23:45:40.717958+00	
00000000-0000-0000-0000-000000000000	95458beb-50c9-422e-8d75-68f7957255c4	{"action":"user_confirmation_requested","actor_id":"7e489272-7e4a-4a08-a3ed-17972e65184c","actor_username":"tulioscaranto.1776127589406@franquia.domempada.app","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-14 00:46:29.783212+00	
00000000-0000-0000-0000-000000000000	345083a4-8090-4856-9491-b109e1c94282	{"action":"user_confirmation_requested","actor_id":"53c72bc9-8ef6-4418-b0c3-c5ea8e125dfd","actor_username":"motorista.teste@domdaempada.local","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 10:52:15.467763+00	
00000000-0000-0000-0000-000000000000	ef5b7821-8748-4fc6-8331-3e39a0681150	{"action":"user_confirmation_requested","actor_id":"f3f3c88e-f7aa-4aee-b747-9a2ae9d9d02e","actor_username":"motorista.teste.cwj1@domdaempada.local","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 11:13:49.259252+00	
00000000-0000-0000-0000-000000000000	e10057e0-e3a4-4a04-bf3e-8ed784c36088	{"action":"user_confirmation_requested","actor_id":"b8494c6e-9d24-4841-9edb-63a4f028bf6a","actor_username":"novo.motorista.sg4b@domdaempada.local","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 11:25:54.52473+00	
00000000-0000-0000-0000-000000000000	b58c580a-3316-4a46-9bae-eb9d453a883d	{"action":"user_confirmation_requested","actor_id":"3d9716f1-4414-4521-801a-3af3801f150e","actor_username":"motorista.novo.59ne@domdaempada.local","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 11:35:52.685776+00	
00000000-0000-0000-0000-000000000000	7a8faac8-ace7-4bc4-9fa5-910cf4e75929	{"action":"user_confirmation_requested","actor_id":"43fbc499-b415-4a6c-ab0a-9d143471c03c","actor_username":"motorista.novo.f95c@domdaempada.local","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 11:43:38.595884+00	
00000000-0000-0000-0000-000000000000	ea0b0972-1f14-4b32-8e6b-2228b309c356	{"action":"user_confirmation_requested","actor_id":"d63d44ee-f749-453b-84fa-61e4e9dd0d75","actor_username":"7ul105k4r4n70@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 11:54:18.820224+00	
00000000-0000-0000-0000-000000000000	48b3ba0a-147d-4f2c-a1c5-5f13f8ea0785	{"action":"user_confirmation_requested","actor_id":"f89372e7-8c13-435e-820d-eddf93ef70eb","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 12:26:34.030808+00	
00000000-0000-0000-0000-000000000000	e32661de-7935-4b36-903f-732e38638fc9	{"action":"user_confirmation_requested","actor_id":"d122429c-b3a3-42f3-ac1a-73f8cfef83f4","actor_username":"teste.motorista.123@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 12:28:49.69407+00	
00000000-0000-0000-0000-000000000000	dfb408ff-7d79-46f1-9d98-015f107dfb26	{"action":"user_confirmation_requested","actor_id":"f01e46f2-9d8e-457c-bb81-851aea2dfe8d","actor_username":"tulio.r.scaranto@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 13:51:51.591788+00	
00000000-0000-0000-0000-000000000000	e9566384-1355-4686-9921-e0f956ec1abb	{"action":"user_confirmation_requested","actor_id":"251a7b98-4342-4fae-9c0b-0e3cbb90cb24","actor_username":"novo@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 14:57:17.462141+00	
00000000-0000-0000-0000-000000000000	7537e3ae-b8c9-4955-81ff-9020519c43a0	{"action":"login","actor_id":"251a7b98-4342-4fae-9c0b-0e3cbb90cb24","actor_username":"novo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 14:58:52.793892+00	
00000000-0000-0000-0000-000000000000	4d4708da-322f-4bef-89b8-15771435693f	{"action":"login","actor_id":"251a7b98-4342-4fae-9c0b-0e3cbb90cb24","actor_username":"novo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 15:12:30.340273+00	
00000000-0000-0000-0000-000000000000	7d3123a6-c3c0-4d2c-a47a-9060a794f6b6	{"action":"logout","actor_id":"251a7b98-4342-4fae-9c0b-0e3cbb90cb24","actor_username":"novo@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-15 15:15:15.451504+00	
00000000-0000-0000-0000-000000000000	acffd198-a52c-4105-b3fe-152fcd05c514	{"action":"login","actor_id":"251a7b98-4342-4fae-9c0b-0e3cbb90cb24","actor_username":"novo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 16:26:13.920257+00	
00000000-0000-0000-0000-000000000000	c4ec8adc-b769-4425-bd1f-ef408c6c5c5f	{"action":"login","actor_id":"967a5461-0a7c-4572-acc6-178fa03a3ca3","actor_username":"7ul105k4r4n70@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 16:29:18.842529+00	
00000000-0000-0000-0000-000000000000	f8e60720-9320-4dc6-81ee-a916f3316d6c	{"action":"login","actor_id":"967a5461-0a7c-4572-acc6-178fa03a3ca3","actor_username":"7ul105k4r4n70@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 16:29:32.480143+00	
00000000-0000-0000-0000-000000000000	15f091d2-ae15-434d-9c71-41d102cd17f0	{"action":"logout","actor_id":"251a7b98-4342-4fae-9c0b-0e3cbb90cb24","actor_username":"novo@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-15 16:30:38.235412+00	
00000000-0000-0000-0000-000000000000	dc24ff93-9d8c-4eb3-aaa3-ac1811703666	{"action":"login","actor_id":"9ac585d5-4e3a-4b44-aa34-20c595f99587","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 16:31:43.107218+00	
00000000-0000-0000-0000-000000000000	8d1bd052-ef38-4372-94e5-8c895b7cf016	{"action":"logout","actor_id":"9ac585d5-4e3a-4b44-aa34-20c595f99587","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account"}	2026-04-15 16:36:29.653507+00	
00000000-0000-0000-0000-000000000000	e45634b0-1332-4c1f-b5c6-f98d687b707c	{"action":"login","actor_id":"967a5461-0a7c-4572-acc6-178fa03a3ca3","actor_username":"7ul105k4r4n70@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 16:37:08.446478+00	
00000000-0000-0000-0000-000000000000	1ff79136-8a53-4057-ace3-9c8b1e0b284e	{"action":"logout","actor_id":"967a5461-0a7c-4572-acc6-178fa03a3ca3","actor_username":"7ul105k4r4n70@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-15 16:41:09.657383+00	
00000000-0000-0000-0000-000000000000	a1f297c9-6d67-4177-9625-8c3a5a60f67a	{"action":"login","actor_id":"967a5461-0a7c-4572-acc6-178fa03a3ca3","actor_username":"7ul105k4r4n70@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 16:58:43.975714+00	
00000000-0000-0000-0000-000000000000	c5010716-6278-44ed-a673-31dcf8fe3fb2	{"action":"login","actor_id":"9ac585d5-4e3a-4b44-aa34-20c595f99587","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 16:59:29.548647+00	
00000000-0000-0000-0000-000000000000	a2f1992d-e80d-483d-87b2-076de4405605	{"action":"logout","actor_id":"9ac585d5-4e3a-4b44-aa34-20c595f99587","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account"}	2026-04-15 16:59:36.822715+00	
00000000-0000-0000-0000-000000000000	09030ac4-0baf-4a27-a891-b21de512f255	{"action":"login","actor_id":"6ca43f8b-280a-47a3-b4fd-2b126ddd701b","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 17:30:05.378587+00	
00000000-0000-0000-0000-000000000000	1ea5beac-0f46-4ee8-895d-f8ca3067ccc1	{"action":"login","actor_id":"6ca43f8b-280a-47a3-b4fd-2b126ddd701b","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 17:30:11.005778+00	
00000000-0000-0000-0000-000000000000	8b5c7307-d7b5-499e-93bf-58100ee7e37f	{"action":"login","actor_id":"6ca43f8b-280a-47a3-b4fd-2b126ddd701b","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 17:38:44.570907+00	
00000000-0000-0000-0000-000000000000	a4567b2c-93b0-426f-acbf-56d5c36db5a6	{"action":"login","actor_id":"6ca43f8b-280a-47a3-b4fd-2b126ddd701b","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 17:40:24.997003+00	
00000000-0000-0000-0000-000000000000	c035eb73-3eaf-4566-8d00-13bf3c6da1e4	{"action":"token_refreshed","actor_id":"6ca43f8b-280a-47a3-b4fd-2b126ddd701b","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-15 20:49:00.285839+00	
00000000-0000-0000-0000-000000000000	4e7d5f4b-3a73-4bf8-9a6b-034a01efdb4c	{"action":"token_revoked","actor_id":"6ca43f8b-280a-47a3-b4fd-2b126ddd701b","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-15 20:49:00.293682+00	
00000000-0000-0000-0000-000000000000	97dc821c-a040-4620-acb2-8b9456185964	{"action":"login","actor_id":"6ca43f8b-280a-47a3-b4fd-2b126ddd701b","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 20:49:18.99285+00	
00000000-0000-0000-0000-000000000000	c8bbb777-2bfe-4c17-aede-9b66951f434e	{"action":"login","actor_id":"6ca43f8b-280a-47a3-b4fd-2b126ddd701b","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 20:49:38.908194+00	
00000000-0000-0000-0000-000000000000	2593c3ad-0914-424d-b4e7-d760eff0226d	{"action":"login","actor_id":"6ca43f8b-280a-47a3-b4fd-2b126ddd701b","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 20:55:34.90636+00	
00000000-0000-0000-0000-000000000000	5ba06df0-d541-42dd-9229-1cfa2237e65a	{"action":"login","actor_id":"2ee9b569-d1b5-4536-a2b4-ef99b65ff530","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 20:56:31.158448+00	
00000000-0000-0000-0000-000000000000	baac613c-b2da-4c14-aa0f-da6c2ea8e9c0	{"action":"login","actor_id":"2ee9b569-d1b5-4536-a2b4-ef99b65ff530","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:02:14.599586+00	
00000000-0000-0000-0000-000000000000	ea12d85b-d95a-4313-bfbc-c3e65fff3d64	{"action":"login","actor_id":"aca2a57d-5086-4506-8c75-18bc9e88f740","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:08:41.621999+00	
00000000-0000-0000-0000-000000000000	46ab72b6-22db-47e6-a286-4e86851e4ff9	{"action":"login","actor_id":"aca2a57d-5086-4506-8c75-18bc9e88f740","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:08:51.713087+00	
00000000-0000-0000-0000-000000000000	849dc40d-da35-49fd-b2ce-1eaa48a4326f	{"action":"login","actor_id":"0e268395-70c8-4f59-a024-2f576b720efe","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:12:55.805483+00	
00000000-0000-0000-0000-000000000000	255a96c6-99e4-4875-b198-84c61663f70f	{"action":"login","actor_id":"0e268395-70c8-4f59-a024-2f576b720efe","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:12:59.752901+00	
00000000-0000-0000-0000-000000000000	f75e3abb-ce29-44f6-b2ae-e203768322dd	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:16:30.838121+00	
00000000-0000-0000-0000-000000000000	a20dd963-0a2b-4286-8873-20bb106a2399	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:16:37.024041+00	
00000000-0000-0000-0000-000000000000	3f415db5-ebb2-4de6-9158-be06a0e2829d	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:21:45.889724+00	
00000000-0000-0000-0000-000000000000	3b0f1e58-fdf4-44f5-9ab0-38cf9bcf4ff4	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:25:38.002626+00	
00000000-0000-0000-0000-000000000000	5edf21fd-f9bc-4b7c-92a4-fdb4f78bf7bb	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:36:22.02457+00	
00000000-0000-0000-0000-000000000000	467708f9-3490-417a-884a-8aa9090ee870	{"action":"logout","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account"}	2026-04-15 21:37:04.228405+00	
00000000-0000-0000-0000-000000000000	6f2db7c5-b503-42eb-b909-962da59b2054	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 21:37:19.280711+00	
00000000-0000-0000-0000-000000000000	16358277-7768-4743-801a-b58571c1f72f	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 21:37:25.546486+00	
00000000-0000-0000-0000-000000000000	c269e7a5-86bb-46dc-9317-0d0186586e2b	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:41:34.324588+00	
00000000-0000-0000-0000-000000000000	c1fecb5d-b699-4693-a875-a804a9e3211d	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 21:43:50.636891+00	
00000000-0000-0000-0000-000000000000	702775e1-fa29-4dfc-ba1a-023dd0ed0feb	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:46:11.311864+00	
00000000-0000-0000-0000-000000000000	5e4b4c8a-8469-46cb-9952-ce48d1278d12	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:53:43.164962+00	
00000000-0000-0000-0000-000000000000	e4948e90-8544-4de9-a2ef-701640d01f9d	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 21:56:37.363664+00	
00000000-0000-0000-0000-000000000000	d7f34581-8d69-4216-a154-fc6a8ac9d296	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 22:00:55.471709+00	
00000000-0000-0000-0000-000000000000	c3cae10d-47b2-4d3d-bc60-e034abeb3e7f	{"action":"logout","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account"}	2026-04-15 22:03:24.003134+00	
00000000-0000-0000-0000-000000000000	c1d569b7-20e3-4a74-9b26-f5e642cbbff2	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 22:03:35.362862+00	
00000000-0000-0000-0000-000000000000	8e9973b4-d864-4ed0-b08d-ad83b0580995	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 22:08:31.425621+00	
00000000-0000-0000-0000-000000000000	13afb8e4-f8eb-4ce1-b295-7cef4d040abf	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 22:18:08.631791+00	
00000000-0000-0000-0000-000000000000	5f3d4bca-f3a2-4dab-9a4f-849c798d0808	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 22:21:28.862907+00	
00000000-0000-0000-0000-000000000000	40af3781-4a3a-43fc-8b41-18fd31240ac1	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 22:38:09.925331+00	
00000000-0000-0000-0000-000000000000	ebcee096-f229-4d24-9b33-9efde1240a6e	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 22:42:48.804124+00	
00000000-0000-0000-0000-000000000000	2ec0ccd1-8467-4d6b-80b2-53d52e9f10b2	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 22:49:10.355256+00	
00000000-0000-0000-0000-000000000000	cb153032-a087-48bf-80b2-5b70175d0995	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 22:53:10.527625+00	
00000000-0000-0000-0000-000000000000	9060bcc9-4a52-45a2-bf6c-c9964d8f2249	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 22:56:19.81556+00	
00000000-0000-0000-0000-000000000000	e74b2c26-f0a7-43e8-b78b-1887c2fec95a	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 23:02:10.364924+00	
00000000-0000-0000-0000-000000000000	573c09b4-5dc4-4162-b8af-e444d5537b7a	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 23:02:33.656769+00	
00000000-0000-0000-0000-000000000000	bdcbb63b-bb96-48fd-ab8e-be162e46be12	{"action":"logout","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account"}	2026-04-15 23:08:09.085065+00	
00000000-0000-0000-0000-000000000000	01be9bd7-f5e3-424a-9e57-f9b388915a39	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 23:08:20.196326+00	
00000000-0000-0000-0000-000000000000	8c0b1e26-ece9-487d-a3d7-b76f1f83c6b7	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 23:11:04.622547+00	
00000000-0000-0000-0000-000000000000	067a1d58-f2f3-4f1b-966e-2f4b2eaf958c	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 23:16:27.874362+00	
00000000-0000-0000-0000-000000000000	328c0d58-9bcd-408d-b786-4ef4f6a92d85	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 23:17:59.861506+00	
00000000-0000-0000-0000-000000000000	13ff3fd3-9b79-40fc-b5df-8b96001de81c	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 23:20:24.004416+00	
00000000-0000-0000-0000-000000000000	c8bea01c-a2cf-441f-ba12-009285fed2e1	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-15 23:23:08.876541+00	
00000000-0000-0000-0000-000000000000	5cb96397-6d8d-4e29-8fd4-8d95b3f41c4d	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 23:35:06.832565+00	
00000000-0000-0000-0000-000000000000	128784f1-5494-4344-9da8-52b35be54395	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 23:38:29.37467+00	
00000000-0000-0000-0000-000000000000	f23d1419-ee8f-4df6-8900-604d97f7b6ed	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-15 23:54:06.134441+00	
00000000-0000-0000-0000-000000000000	88ca5de7-02ab-42ab-b223-6db7a15c21df	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 02:09:43.280297+00	
00000000-0000-0000-0000-000000000000	4c5840d7-2f57-44f4-88c2-c72287d42653	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 02:29:28.635632+00	
00000000-0000-0000-0000-000000000000	7ab3546e-f1e7-4d0d-9cf1-3f2e0c8e9d12	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 02:32:24.070075+00	
00000000-0000-0000-0000-000000000000	a57c1fde-295c-44f8-addf-7af223508945	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 10:23:22.612715+00	
00000000-0000-0000-0000-000000000000	9fed5605-cc1a-45c2-b876-329fdb76b591	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 10:32:53.762237+00	
00000000-0000-0000-0000-000000000000	274a1812-43eb-4e62-abf3-32a7b0c9a571	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 10:36:51.081746+00	
00000000-0000-0000-0000-000000000000	cb1d251f-ed4c-4f17-b597-b7ed057c5c4e	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 11:39:38.891314+00	
00000000-0000-0000-0000-000000000000	e903b428-fab4-4986-873f-90143be3c31a	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 11:40:42.250874+00	
00000000-0000-0000-0000-000000000000	7121e733-332b-4c93-b8d1-cb1c335afea8	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 11:43:24.721052+00	
00000000-0000-0000-0000-000000000000	7d8f37ab-079c-42a5-ba77-2bf965ea10e3	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 12:15:24.36064+00	
00000000-0000-0000-0000-000000000000	00f7ff37-6986-430e-bd61-25da99b06b88	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 12:32:12.77335+00	
00000000-0000-0000-0000-000000000000	b8139c73-a9c9-4a5c-a32e-dd855331de6e	{"action":"token_refreshed","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-16 13:48:45.495798+00	
00000000-0000-0000-0000-000000000000	dab3b048-77d8-405f-9118-9b224e91f36a	{"action":"token_revoked","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-16 13:48:45.498075+00	
00000000-0000-0000-0000-000000000000	355c63b7-8cea-4c90-931e-8f19d99ebc19	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 14:28:39.93195+00	
00000000-0000-0000-0000-000000000000	73895270-ddcb-486d-bbb3-10c9e3596cd9	{"action":"token_refreshed","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-16 15:02:31.370925+00	
00000000-0000-0000-0000-000000000000	33455cf1-0bfd-4794-bc1b-8e01b9f85397	{"action":"token_revoked","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-16 15:02:31.372797+00	
00000000-0000-0000-0000-000000000000	2ce6975d-2cb1-4eed-be76-0f13100a2583	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 15:02:38.050798+00	
00000000-0000-0000-0000-000000000000	d3bfdd14-fa94-47db-b653-0ced803b5438	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 15:15:50.153414+00	
00000000-0000-0000-0000-000000000000	a754691b-7f28-4e3d-9ba2-24ae0f8f6fb9	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 15:20:05.234782+00	
00000000-0000-0000-0000-000000000000	fcbd8d30-bfd2-429a-93ac-c150b517de85	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 15:28:47.47742+00	
00000000-0000-0000-0000-000000000000	c76a6b13-285f-44c7-a9c3-77a65fe853bb	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 15:29:16.443316+00	
00000000-0000-0000-0000-000000000000	9d266224-92e2-4d86-b367-6cf8167c4ff1	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 16:02:07.648582+00	
00000000-0000-0000-0000-000000000000	dfda3324-a678-46ea-b4a1-b86397a23233	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 16:12:30.374077+00	
00000000-0000-0000-0000-000000000000	1a1f74ef-f811-421e-a7c9-cf9dea0676db	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 16:13:56.898679+00	
00000000-0000-0000-0000-000000000000	2da5cbbf-078b-4148-b589-fd588a8ee4f6	{"action":"token_refreshed","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-16 18:13:53.63693+00	
00000000-0000-0000-0000-000000000000	9aece450-719f-4f58-8da4-b9da227ddcb4	{"action":"token_revoked","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-16 18:13:53.650967+00	
00000000-0000-0000-0000-000000000000	7f098bbe-32fa-41f8-aeb7-970abbd62b48	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 18:24:10.541441+00	
00000000-0000-0000-0000-000000000000	cc07cfd7-f82d-4bf4-bd6b-e0f0ca24e72a	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 18:43:20.89031+00	
00000000-0000-0000-0000-000000000000	bfe595d4-4b9e-4e94-9360-86efca5b2828	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 21:08:09.439765+00	
00000000-0000-0000-0000-000000000000	11a63d57-ac58-43bf-be4e-cf53c9a50e21	{"action":"token_refreshed","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-16 21:09:50.348246+00	
00000000-0000-0000-0000-000000000000	3294a106-af39-4f86-b6c2-6582cf0e326a	{"action":"token_revoked","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-16 21:09:50.350101+00	
00000000-0000-0000-0000-000000000000	ac42d4e3-8d91-4124-bb85-065fdffcf66b	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 21:09:53.617795+00	
00000000-0000-0000-0000-000000000000	7c51ef33-74f4-41f7-b33f-0cb1633ce2ff	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 21:20:41.906963+00	
00000000-0000-0000-0000-000000000000	20d1352c-c9e7-4518-9a51-15df72c621a7	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 21:34:23.996767+00	
00000000-0000-0000-0000-000000000000	bc5e6dc8-c542-446c-bc04-0e75a4ddaa32	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 21:38:02.840345+00	
00000000-0000-0000-0000-000000000000	7ca78f6f-0af5-4e72-b196-0cc8b7886f77	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 21:39:45.462067+00	
00000000-0000-0000-0000-000000000000	e9809620-f99f-40bd-85cb-d11ea0600cac	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 21:48:25.849521+00	
00000000-0000-0000-0000-000000000000	d21420d5-7e7e-4099-bd9f-9ae10b314a19	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 21:57:37.35943+00	
00000000-0000-0000-0000-000000000000	70bc9521-7171-4819-b8bd-e3c62af68157	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 22:07:21.105088+00	
00000000-0000-0000-0000-000000000000	c824e950-17c1-4a7a-8d95-b1f52dda2d06	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 22:10:36.205538+00	
00000000-0000-0000-0000-000000000000	40e17030-bd99-4fe6-9e8f-a2710eb6ec94	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 22:11:28.680942+00	
00000000-0000-0000-0000-000000000000	bd72e516-1815-4216-b781-829010063174	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 22:13:12.218259+00	
00000000-0000-0000-0000-000000000000	9c476395-7bc9-4962-b8c0-2be8296c95c1	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 22:13:56.207697+00	
00000000-0000-0000-0000-000000000000	a67ff045-471a-430a-a8c3-18db140f7b68	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 22:17:01.537462+00	
00000000-0000-0000-0000-000000000000	f520904d-1ffa-4aad-b73f-d0ae8c4c7f20	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 22:18:18.148254+00	
00000000-0000-0000-0000-000000000000	a4b94a48-e88b-4231-ba91-780c9cf2d713	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 22:19:40.809233+00	
00000000-0000-0000-0000-000000000000	58ba4549-99c6-4b7d-9c2b-d868b514f7cc	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 22:22:02.113856+00	
00000000-0000-0000-0000-000000000000	30c95415-914f-42be-bbb2-ce118929401c	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 22:24:46.579282+00	
00000000-0000-0000-0000-000000000000	58102d53-3daf-4098-b27b-7d4f072ddac8	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 22:34:26.089842+00	
00000000-0000-0000-0000-000000000000	5b5625c2-9bcf-4006-9cbf-551778899a86	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 22:36:35.050718+00	
00000000-0000-0000-0000-000000000000	4368bde4-5127-4bc2-b28b-49390fa2fd9f	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 22:38:32.001383+00	
00000000-0000-0000-0000-000000000000	53d0e64b-a684-46a2-85e6-0694020d6960	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 23:00:58.543352+00	
00000000-0000-0000-0000-000000000000	4ebc8ede-2c05-465c-8d35-0da6028351bd	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-16 23:11:53.428758+00	
00000000-0000-0000-0000-000000000000	26131fce-3eda-418a-b7b0-8ffe49947e46	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-16 23:17:24.408554+00	
00000000-0000-0000-0000-000000000000	5f28b050-e797-4ee0-99d9-65d224cfdd3c	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-17 11:02:12.235582+00	
00000000-0000-0000-0000-000000000000	16423577-392c-4e6b-be64-9f163377fa55	{"action":"token_refreshed","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-18 19:49:52.655827+00	
00000000-0000-0000-0000-000000000000	a8a8fe56-c7e9-4cd8-8ee5-095afd41a589	{"action":"token_revoked","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-18 19:49:52.659625+00	
00000000-0000-0000-0000-000000000000	917aa1ac-4184-468c-ae3a-bb12987692fc	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-18 19:49:57.406411+00	
00000000-0000-0000-0000-000000000000	580ac6e0-4f09-4197-942b-48d3e3813fd7	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-18 20:13:37.271881+00	
00000000-0000-0000-0000-000000000000	7af5418a-2dd6-4a09-a55e-6890ae15c51e	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-18 20:24:09.434598+00	
00000000-0000-0000-0000-000000000000	114227e2-850b-4b90-aebf-a9446e722e91	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-18 20:44:03.906777+00	
00000000-0000-0000-0000-000000000000	92954236-b640-47a7-97dd-a7e317274e63	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-18 20:47:10.581239+00	
00000000-0000-0000-0000-000000000000	dab9f133-593b-466a-b295-8e49574166ec	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-18 20:52:41.752468+00	
00000000-0000-0000-0000-000000000000	8039def4-d4dc-43c3-8a8b-a842b483d6c6	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-18 21:14:25.43306+00	
00000000-0000-0000-0000-000000000000	5d0fd3ec-17c7-4553-ab53-1c88a19ae700	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-18 21:42:14.099351+00	
00000000-0000-0000-0000-000000000000	6dbfade9-34c8-4709-b69f-9251776c40e7	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-18 22:29:59.901093+00	
00000000-0000-0000-0000-000000000000	19e96522-47c8-490f-8cbc-c9d863d8084d	{"action":"token_refreshed","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-18 22:41:48.120916+00	
00000000-0000-0000-0000-000000000000	1c9632bc-c4a8-4ed8-a808-b216232cee71	{"action":"token_revoked","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-18 22:41:48.122669+00	
00000000-0000-0000-0000-000000000000	0099fd49-0abb-4172-b6a3-1be3c5147fce	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-18 22:58:16.485996+00	
00000000-0000-0000-0000-000000000000	7198e625-0945-4240-81ac-59b34042bad0	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-18 23:14:35.028354+00	
00000000-0000-0000-0000-000000000000	920e569a-9c8c-408e-a2bf-800d4fdca4c9	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-18 23:16:28.946935+00	
00000000-0000-0000-0000-000000000000	1605a920-f1a1-46b8-aca9-abe41ee7a095	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-18 23:17:17.47486+00	
00000000-0000-0000-0000-000000000000	82083c23-82ef-43d1-abb6-d10ccf0117d6	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-18 23:17:46.217104+00	
00000000-0000-0000-0000-000000000000	88e9c5a8-597a-440d-be5b-8e31f095c2e8	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-18 23:33:15.36754+00	
00000000-0000-0000-0000-000000000000	74c04950-971a-4881-aeb0-89f5b10c8e0a	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-18 23:44:31.337238+00	
00000000-0000-0000-0000-000000000000	5bd0c9ba-dd02-4670-ac25-e6d399905c7d	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-18 23:49:57.016706+00	
00000000-0000-0000-0000-000000000000	84955ae0-794b-458c-aecd-e17cc07e30f6	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 00:12:39.184028+00	
00000000-0000-0000-0000-000000000000	adad6903-028d-45fb-904d-8f37752b7cd2	{"action":"token_refreshed","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-19 00:32:59.378586+00	
00000000-0000-0000-0000-000000000000	15f52d0a-81f9-451f-827d-1d863221ab88	{"action":"token_revoked","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-19 00:32:59.380106+00	
00000000-0000-0000-0000-000000000000	e6c7a17c-9978-4210-a895-ec7ea750a2a8	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 14:34:49.568392+00	
00000000-0000-0000-0000-000000000000	b9616b7f-845c-4056-8aac-66ded116e004	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 14:49:17.835816+00	
00000000-0000-0000-0000-000000000000	364fc2f0-34a7-4340-ad68-1904c90b2486	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 14:53:49.850407+00	
00000000-0000-0000-0000-000000000000	a8698943-7189-49ac-af76-9b7100b395db	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 15:22:27.631807+00	
00000000-0000-0000-0000-000000000000	74e0c80d-f073-4fec-ac85-39929c21c07a	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 15:30:20.839337+00	
00000000-0000-0000-0000-000000000000	c1aed6ff-78cf-4180-9e57-90d483e258ce	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 15:32:24.771512+00	
00000000-0000-0000-0000-000000000000	91a2c8d8-976b-4116-9fe8-e8276878e21d	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 15:58:55.867053+00	
00000000-0000-0000-0000-000000000000	47957dbb-5def-405c-8b84-4160c35861b8	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 17:52:46.758283+00	
00000000-0000-0000-0000-000000000000	7c687030-4195-45e1-aa91-8d9f5660af87	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 18:04:32.246862+00	
00000000-0000-0000-0000-000000000000	aeb9b1a9-0086-4fb6-93e0-dd48bd498dab	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 18:11:22.497737+00	
00000000-0000-0000-0000-000000000000	a32b8862-74fa-499e-a3d2-c800e29551fd	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 18:47:14.452104+00	
00000000-0000-0000-0000-000000000000	3bad1f33-5791-4f8c-b043-e50bb66b288b	{"action":"user_repeated_signup","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 19:04:22.679262+00	
00000000-0000-0000-0000-000000000000	6e33dcbb-ec40-40b2-87f4-66fc865ffc9c	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 19:12:48.330593+00	
00000000-0000-0000-0000-000000000000	d807c2ea-34e5-4c49-a7b8-97a30606406d	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 19:18:51.261444+00	
00000000-0000-0000-0000-000000000000	e80940f2-465a-40fc-bb0e-d600713314c0	{"action":"user_confirmation_requested","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 19:26:17.083993+00	
00000000-0000-0000-0000-000000000000	6c883709-db07-4e85-9f0d-27dcdc0d5aad	{"action":"user_repeated_signup","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 19:28:21.20138+00	
00000000-0000-0000-0000-000000000000	fb9e6657-e86b-4ada-a420-4952977c179b	{"action":"user_confirmation_requested","actor_id":"6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e","actor_username":"felipe@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 19:28:38.288426+00	
00000000-0000-0000-0000-000000000000	6d4cc8da-e36f-4600-887a-6ba710abd969	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 19:29:53.781263+00	
00000000-0000-0000-0000-000000000000	fa4ba113-ab5d-4e0c-8e75-898a80e1f5e4	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 19:30:38.255062+00	
00000000-0000-0000-0000-000000000000	42ea7eee-8e9b-4f09-ba4d-9e79103c8787	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 19:38:57.736454+00	
00000000-0000-0000-0000-000000000000	77d72fd4-5694-4329-bc2b-c7686f88de74	{"action":"user_repeated_signup","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-04-19 20:11:07.908129+00	
00000000-0000-0000-0000-000000000000	3b5490f4-0791-4124-8504-08c6fd0b377c	{"action":"login","actor_id":"6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e","actor_username":"felipe@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 20:12:50.770527+00	
00000000-0000-0000-0000-000000000000	02892870-4545-4b2a-afd3-a9cbd1054b9b	{"action":"token_refreshed","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-19 20:29:31.298249+00	
00000000-0000-0000-0000-000000000000	2dc49cd9-e613-47b5-845f-d9b273d29708	{"action":"token_revoked","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"token"}	2026-04-19 20:29:31.299401+00	
00000000-0000-0000-0000-000000000000	2562a7e5-9b93-417e-bf0f-29bc0344eb71	{"action":"token_refreshed","actor_id":"6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e","actor_username":"felipe@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 21:11:26.376072+00	
00000000-0000-0000-0000-000000000000	1af79235-b911-43bd-964e-91be6379ea64	{"action":"token_revoked","actor_id":"6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e","actor_username":"felipe@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 21:11:26.377388+00	
00000000-0000-0000-0000-000000000000	80b0dd8e-6210-48c2-a432-26683d612b38	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 21:46:20.775448+00	
00000000-0000-0000-0000-000000000000	84803d88-9f35-4386-81b6-9a404ca9c816	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:11:51.269538+00	
00000000-0000-0000-0000-000000000000	add4e929-83dc-4ce5-9fa9-97a7326e2924	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:19:20.142912+00	
00000000-0000-0000-0000-000000000000	1d9c26ef-59eb-465a-8aec-4fc17602a451	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 22:19:32.822823+00	
00000000-0000-0000-0000-000000000000	50e1b2df-471a-4d57-ba16-998ab20662ec	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:19:43.523646+00	
00000000-0000-0000-0000-000000000000	7256a3c1-c518-455b-a074-eefc711cb19a	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 22:35:26.156338+00	
00000000-0000-0000-0000-000000000000	8306e454-8500-4916-8389-e25b75366757	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:38:18.794709+00	
00000000-0000-0000-0000-000000000000	d96c0676-9ca7-4167-84a8-14358cba4fb3	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:41:58.330976+00	
00000000-0000-0000-0000-000000000000	17d2151d-a89f-4c10-8b0c-6d2a990f95f5	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:43:58.630684+00	
00000000-0000-0000-0000-000000000000	95f5ffa5-3c7a-4010-ab6d-c1fbe05c118d	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:46:51.107118+00	
00000000-0000-0000-0000-000000000000	705b0215-3944-4f84-8633-619efbf580df	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:47:30.694122+00	
00000000-0000-0000-0000-000000000000	1b4f1bd4-5e7e-423d-87ed-4c50d4b63e7c	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:49:50.507267+00	
00000000-0000-0000-0000-000000000000	4fc2e174-66f6-4bb5-a3c5-adebf92d91aa	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:52:55.997997+00	
00000000-0000-0000-0000-000000000000	bc7f95e4-0242-4854-8603-6cbd8b48d583	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 22:56:27.895268+00	
00000000-0000-0000-0000-000000000000	fb41d2c1-159b-4741-b176-e87a7c0619a3	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 22:56:39.988081+00	
00000000-0000-0000-0000-000000000000	b6cb60b4-c6e0-4b35-80fc-8581138671da	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:11:31.011047+00	
00000000-0000-0000-0000-000000000000	1cf6a218-d50c-4dc1-991c-e1ee339926da	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:12:03.16126+00	
00000000-0000-0000-0000-000000000000	24c743f1-375e-4926-a72f-7059f40ab24a	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:12:19.717978+00	
00000000-0000-0000-0000-000000000000	2cc6cdef-d997-402d-92a0-91525fc17892	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:12:34.063009+00	
00000000-0000-0000-0000-000000000000	1b6f554f-dc55-4e7e-9116-2446c5d36992	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:13:13.419332+00	
00000000-0000-0000-0000-000000000000	40332611-6d34-4fba-9a01-1b70a9ff6c43	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:13:20.784084+00	
00000000-0000-0000-0000-000000000000	81b31d55-36b0-4e41-a4a7-2a6d81df6c21	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:14:11.141295+00	
00000000-0000-0000-0000-000000000000	679ec52a-bba9-4ffb-af83-1e263f7b6649	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:14:31.240927+00	
00000000-0000-0000-0000-000000000000	731e63e7-3e81-420c-b818-783f14a351ad	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:14:44.943+00	
00000000-0000-0000-0000-000000000000	a689a32b-9fb1-4b03-bd4c-c1e378c235fe	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:17:27.204813+00	
00000000-0000-0000-0000-000000000000	f8fe72d3-8326-41a0-84d4-54aa9207731e	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:21:20.187481+00	
00000000-0000-0000-0000-000000000000	7d2a8146-3667-4468-bb75-67a8a76615e7	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:21:38.971413+00	
00000000-0000-0000-0000-000000000000	8f9c1bbf-134d-4eeb-b013-be88ebd55660	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:22:00.823435+00	
00000000-0000-0000-0000-000000000000	893164cf-4678-40a5-aee0-a31f8e862129	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:22:18.410808+00	
00000000-0000-0000-0000-000000000000	842afe9d-e1b4-431e-8b03-bf69fbb203b4	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:22:39.262785+00	
00000000-0000-0000-0000-000000000000	37cf70c5-7465-404e-90ca-a91d29b8b31b	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:22:57.739074+00	
00000000-0000-0000-0000-000000000000	6aac0e24-f243-44b2-8ff9-567833d1f48d	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:23:25.678351+00	
00000000-0000-0000-0000-000000000000	81b2006e-2ab7-4669-aeb1-c53dac3f96dd	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:23:42.935736+00	
00000000-0000-0000-0000-000000000000	82c5e71c-c5c2-49c8-92a5-d3cf9e23ed1e	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:36:18.163155+00	
00000000-0000-0000-0000-000000000000	ce8d977e-e7d4-4176-a523-1008ffd84f37	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:36:49.530299+00	
00000000-0000-0000-0000-000000000000	7ed82902-a4b7-43e4-8038-658588e60aaf	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:38:51.447074+00	
00000000-0000-0000-0000-000000000000	05b4e92f-e405-45b3-b7c2-af174a82b0db	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:39:04.105586+00	
00000000-0000-0000-0000-000000000000	bb6ef300-614d-4906-8c2c-75f99498be1a	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:39:32.059+00	
00000000-0000-0000-0000-000000000000	6b5fb797-42ba-4645-84ce-8ca39b731580	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:39:45.988621+00	
00000000-0000-0000-0000-000000000000	4417fbc6-6ccb-4aab-a5d7-f1d023341df5	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-19 23:40:09.684424+00	
00000000-0000-0000-0000-000000000000	ebfc2755-5404-43cd-87a8-a4d00d7cbb01	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:40:25.076782+00	
00000000-0000-0000-0000-000000000000	c859968c-b0d7-4fc1-abeb-c9fd8419b295	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:41:48.834042+00	
00000000-0000-0000-0000-000000000000	b680237d-0db1-44e6-9b2b-d1fb9a7fe058	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-19 23:59:59.914551+00	
00000000-0000-0000-0000-000000000000	f1564003-982e-4a4a-ad4a-8793408ed098	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 10:13:50.647449+00	
00000000-0000-0000-0000-000000000000	262c0721-b8f4-4332-bed1-85fd48586e0e	{"action":"login","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 10:14:15.543229+00	
00000000-0000-0000-0000-000000000000	34489d34-daf5-49d2-a6e2-8310a9f24d66	{"action":"logout","actor_id":"b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163","actor_username":"motorista@gmail","actor_via_sso":false,"log_type":"account"}	2026-04-20 10:16:51.020915+00	
00000000-0000-0000-0000-000000000000	f8400928-062e-4a42-a94e-316318ce890c	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 10:17:04.974923+00	
00000000-0000-0000-0000-000000000000	b45f9bbe-61a6-4bdb-bd92-24adb7e6644c	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 11:31:03.334806+00	
00000000-0000-0000-0000-000000000000	a902931e-bbfa-4070-96bc-8589cd8c2574	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 11:41:40.963644+00	
00000000-0000-0000-0000-000000000000	d43baef1-b8c3-4071-afa1-7800ed2561ad	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 11:41:55.269851+00	
00000000-0000-0000-0000-000000000000	15073aa3-598f-46f8-a353-af16b1bc3547	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 11:41:56.891647+00	
00000000-0000-0000-0000-000000000000	4b68b668-89d0-463e-8e89-0ee755fc7edb	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 11:42:02.87667+00	
00000000-0000-0000-0000-000000000000	959fe566-fd72-4aea-97e7-95a7285b2f83	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 11:42:04.484829+00	
00000000-0000-0000-0000-000000000000	0407d256-0ca1-4df7-ac23-ca8532f3aba6	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 11:46:56.657521+00	
00000000-0000-0000-0000-000000000000	b19cc171-5f61-47f0-9127-684d10f1a4bb	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 11:46:58.314084+00	
00000000-0000-0000-0000-000000000000	5e839cd9-5317-4672-bbfd-3a4b6eb020a7	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 11:49:31.64752+00	
00000000-0000-0000-0000-000000000000	a74a9536-dc84-4031-bc11-7ac14d15f524	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 12:00:29.28521+00	
00000000-0000-0000-0000-000000000000	efe4abd1-2778-4971-9b9e-aef0b8745098	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 12:23:00.745475+00	
00000000-0000-0000-0000-000000000000	1a36002f-0f7b-4408-890b-518e60135f43	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 12:23:02.518371+00	
00000000-0000-0000-0000-000000000000	8f4c2ce2-701c-48ec-b817-1967778357ba	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 12:26:15.515246+00	
00000000-0000-0000-0000-000000000000	67c56110-e9cf-43a6-a9c9-653a243c3d2b	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 12:31:20.566258+00	
00000000-0000-0000-0000-000000000000	d8c1b75f-a7c8-4b6a-bfe5-764854e9e879	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 12:31:22.14158+00	
00000000-0000-0000-0000-000000000000	d4213744-adad-4a3e-9221-aee9d8c82baa	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 12:44:27.993207+00	
00000000-0000-0000-0000-000000000000	1d893d4d-da72-4c69-a4b6-b9cebc2bda4f	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 12:53:38.769008+00	
00000000-0000-0000-0000-000000000000	344cefeb-0927-49aa-b651-58506dc1d8db	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 12:54:08.233351+00	
00000000-0000-0000-0000-000000000000	5baa5a15-0556-4122-b53a-00117ac8bac7	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:05:12.09652+00	
00000000-0000-0000-0000-000000000000	240ba27e-ea41-42ef-8017-b71845b74af5	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:05:30.523478+00	
00000000-0000-0000-0000-000000000000	fbf506d6-29fe-49a2-89d6-bd27e8ae3fd3	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:06:34.946131+00	
00000000-0000-0000-0000-000000000000	fcd3ab98-1245-480b-b0b6-1f9262868b56	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:09:47.082361+00	
00000000-0000-0000-0000-000000000000	794465a5-957c-4c60-b822-d41c48da372d	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 13:15:58.853903+00	
00000000-0000-0000-0000-000000000000	a979726f-98a1-451b-ab80-b7463ba94090	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:15:59.973905+00	
00000000-0000-0000-0000-000000000000	061fe13d-1073-485f-8984-4a261c083c44	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 13:23:17.404919+00	
00000000-0000-0000-0000-000000000000	bbe2e471-0404-4bd3-8c1b-ffec95f0fee4	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:23:18.850136+00	
00000000-0000-0000-0000-000000000000	89f82ccc-88b5-4ee2-8c4a-64313be781dd	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:25:17.297163+00	
00000000-0000-0000-0000-000000000000	b3ab4043-62fc-458d-9f03-e16b7e3bd70d	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:41:11.590443+00	
00000000-0000-0000-0000-000000000000	c3fd3e83-24c7-4b03-9928-83c0e846f6f1	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 13:44:51.826198+00	
00000000-0000-0000-0000-000000000000	b64bcfa2-f38d-45eb-a290-eacedc927bbf	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:45:10.254095+00	
00000000-0000-0000-0000-000000000000	7a61d298-c57f-49ce-8d90-5448b4129ebb	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:45:40.300545+00	
00000000-0000-0000-0000-000000000000	34161fd8-5950-4a59-83d7-ac6609a58c0a	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-20 13:53:10.337602+00	
00000000-0000-0000-0000-000000000000	8f852f7d-5d0b-403b-bbea-1a2212dd5da3	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:53:12.22148+00	
00000000-0000-0000-0000-000000000000	7f3d2496-49bf-4bce-9338-7ce1ce2a2a48	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 13:56:49.220856+00	
00000000-0000-0000-0000-000000000000	99c75b60-5a0c-4f1d-a4c7-31f6ce22bb8c	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 13:56:51.326733+00	
00000000-0000-0000-0000-000000000000	09d0f7af-6ec1-40b6-8e49-158fe1c360d9	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 14:04:17.080359+00	
00000000-0000-0000-0000-000000000000	94ec56d6-a560-404e-8cec-fecd2431deb8	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 14:13:26.250658+00	
00000000-0000-0000-0000-000000000000	159ebeeb-ab51-489d-b0b2-e181c75c694b	{"action":"logout","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-20 14:26:38.314027+00	
00000000-0000-0000-0000-000000000000	256ab64d-5f41-4d6b-9609-49dfe42413b3	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 14:30:20.186902+00	
00000000-0000-0000-0000-000000000000	27bf8c30-e339-4d45-b301-1d44bd78d25a	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 15:58:46.816674+00	
00000000-0000-0000-0000-000000000000	83e88453-8487-4a05-884f-78521c2d7611	{"action":"login","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 18:53:37.900611+00	
00000000-0000-0000-0000-000000000000	b2eb005a-00cc-497b-98f3-eca448901c0a	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 19:00:35.792649+00	
00000000-0000-0000-0000-000000000000	d9e6bf5c-8c1c-45d7-b442-efb7a963974c	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 19:07:48.945961+00	
00000000-0000-0000-0000-000000000000	b83848ad-2972-4d50-b89b-bc171355eeac	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 19:09:39.814323+00	
00000000-0000-0000-0000-000000000000	27e3b290-09c7-4e83-acb4-3298671fccac	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 20:56:29.908375+00	
00000000-0000-0000-0000-000000000000	7698d303-b122-4e5c-b042-757903fe2e80	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 20:57:52.828453+00	
00000000-0000-0000-0000-000000000000	5a1fdb5e-006a-4fff-9217-5535e2024e06	{"action":"token_refreshed","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-20 20:59:58.411401+00	
00000000-0000-0000-0000-000000000000	6ea093c1-001a-4b80-9b8a-439ab74942eb	{"action":"token_revoked","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-20 20:59:58.413193+00	
00000000-0000-0000-0000-000000000000	7a614c31-a122-42b4-90cd-060c04b32901	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 21:02:26.355237+00	
00000000-0000-0000-0000-000000000000	2c06ef30-6e0d-41bf-9e6d-b07c7a5aaa78	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 21:15:50.871577+00	
00000000-0000-0000-0000-000000000000	6edd9c31-ea86-4cbb-b21b-bbf055c50ef8	{"action":"token_refreshed","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-20 21:26:09.559468+00	
00000000-0000-0000-0000-000000000000	95aa269c-11be-4d3d-8710-564b20be49b4	{"action":"token_revoked","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-20 21:26:09.56252+00	
00000000-0000-0000-0000-000000000000	5a605597-41b0-4c93-933f-d3ae6178f0f2	{"action":"token_refreshed","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-20 22:45:43.04537+00	
00000000-0000-0000-0000-000000000000	0b0d6209-f2e1-433f-8e7b-d8911b948fe2	{"action":"token_revoked","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-20 22:45:43.046526+00	
00000000-0000-0000-0000-000000000000	22cbdad7-77d4-4964-8fb9-17504aed9a25	{"action":"token_refreshed","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-20 23:31:45.45731+00	
00000000-0000-0000-0000-000000000000	5bbc8fdf-5ae6-49d3-b25f-1a869f694f81	{"action":"token_revoked","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-20 23:31:45.458987+00	
00000000-0000-0000-0000-000000000000	20f29006-e621-45ca-a553-f9e7b4b2a012	{"action":"token_refreshed","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-20 23:33:28.733686+00	
00000000-0000-0000-0000-000000000000	e0c2a1e1-287d-486f-bbe6-a6d789cf3a0b	{"action":"token_revoked","actor_id":"398ef1e1-3188-4897-a203-dc4f0e4bedda","actor_username":"ismael@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-20 23:33:28.73504+00	
00000000-0000-0000-0000-000000000000	24128609-8517-4dee-922e-613f072d9087	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 23:34:57.014489+00	
00000000-0000-0000-0000-000000000000	3f561bfe-52bd-4ae5-84a3-3b80998c3d9c	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 23:35:30.744086+00	
00000000-0000-0000-0000-000000000000	ace84203-dc99-4f78-86fb-30976ffebf5b	{"action":"login","actor_id":"6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e","actor_username":"felipe@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-20 23:46:18.608587+00	
00000000-0000-0000-0000-000000000000	d7665723-4745-4f4b-8219-9054d2e1c6ff	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-21 00:13:52.480238+00	
00000000-0000-0000-0000-000000000000	95683d2f-f3bc-4e88-bb3b-c3b7ecb4e8d1	{"action":"token_refreshed","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-21 02:44:24.151623+00	
00000000-0000-0000-0000-000000000000	f51281ce-3b35-46ef-941b-028c110b7904	{"action":"token_revoked","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-21 02:44:24.155641+00	
00000000-0000-0000-0000-000000000000	cbfab2d9-652d-4a9a-befd-b0068b8da59c	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-21 05:11:19.643537+00	
00000000-0000-0000-0000-000000000000	c058ce3b-0d1c-4ce8-9f67-ed4dabfc401f	{"action":"token_refreshed","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-21 05:20:38.430739+00	
00000000-0000-0000-0000-000000000000	67555ea9-4f62-462d-a168-69edeaa59bb2	{"action":"token_revoked","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"token"}	2026-04-21 05:20:38.432558+00	
00000000-0000-0000-0000-000000000000	810f7822-e191-4496-b0e5-efa9ffee57a8	{"action":"logout","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account"}	2026-04-21 05:20:42.169254+00	
00000000-0000-0000-0000-000000000000	763f84bf-a999-4600-acd6-c17fc5310bb6	{"action":"login","actor_id":"dc1dd703-112a-4ac7-b947-2c81562896b7","actor_username":"contato@sk4r4n70.cloud","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-21 17:24:41.774974+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	967a5461-0a7c-4572-acc6-178fa03a3ca3	authenticated	authenticated	7ul105k4r4n70@gmail.com	$2a$10$wBK8YEQInxmboj/yMtetkuxbvR13CN/RNvT5dfRSKl11.k2k79fBO	2026-04-15 16:29:18.806136+00	\N		\N		\N			\N	2026-04-15 16:58:43.979285+00	{"provider": "email", "providers": ["email"]}	{"sub": "967a5461-0a7c-4572-acc6-178fa03a3ca3", "email": "7ul105k4r4n70@gmail.com", "email_verified": false, "phone_verified": false}	\N	2026-04-15 16:29:18.807376+00	2026-04-15 16:58:43.987369+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	authenticated	authenticated	felipe@gmail.com	$2a$10$VIV8/OFvcK2KWEiAmVrzCuxUMWv47f59CWdctE7Rt/0tyVLx7h8OW	2026-04-19 19:28:38.283701+00	\N	b3b2f95fc3ce3de74cdbe30d896ec3a23c810d91e306289d832c180f	2026-04-19 19:28:38.2894+00		\N			\N	2026-04-20 23:46:18.610656+00	{"provider": "email", "providers": ["email"]}	{}	\N	2026-04-19 19:28:38.284413+00	2026-04-20 23:46:18.616502+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	dc1dd703-112a-4ac7-b947-2c81562896b7	authenticated	authenticated	contato@sk4r4n70.cloud	$2a$10$YKx7L4BFC5e5lUUoSD3FnuXgesKFVG/svqcEz.szL89Bwb/h3YSBO	2026-04-19 19:26:17.068728+00	\N	4b9a8d10a80bd78eddf47876bda0952d794c380c0c710fd94d3f97c4	2026-04-19 19:26:17.088038+00		\N			\N	2026-04-21 17:24:41.784821+00	{"provider": "email", "providers": ["email"]}	{}	\N	2026-04-19 19:26:17.069106+00	2026-04-21 17:24:41.802166+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	authenticated	authenticated	motorista@gmail	$2a$10$jPcC.1gocGN8pV.pDNJBW.agt3QntMKC3Ojp4rPYwj/U/nzK2jhuG	2026-04-15 21:16:30.811158+00	\N		\N		\N			\N	2026-04-20 10:14:15.548423+00	{"provider": "email", "providers": ["email"]}	{"sub": "b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163", "email": "motorista@gmail", "email_verified": false, "phone_verified": false}	\N	2026-04-15 21:16:30.81159+00	2026-04-20 10:14:15.557878+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	398ef1e1-3188-4897-a203-dc4f0e4bedda	authenticated	authenticated	ismael@gmail.com	$2a$10$nbt56obxQIm1hetJqvPVU.WNQoAEbX9FF5aT6IVnlNluR8hPgUEbO	2026-04-19 19:29:53.749624+00	\N		\N		\N			\N	2026-04-20 18:53:37.910116+00	{"provider": "email", "providers": ["email"]}	{"sub": "398ef1e1-3188-4897-a203-dc4f0e4bedda", "email": "ismael@gmail.com", "email_verified": false, "phone_verified": false}	\N	2026-04-19 19:29:53.750152+00	2026-04-20 23:33:28.738571+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
967a5461-0a7c-4572-acc6-178fa03a3ca3	967a5461-0a7c-4572-acc6-178fa03a3ca3	{"sub": "967a5461-0a7c-4572-acc6-178fa03a3ca3", "email": "7ul105k4r4n70@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-04-15 16:29:18.821441+00	2026-04-15 16:29:18.821634+00	2026-04-15 16:29:18.821634+00	55d82d70-7255-43be-855b-d2a8ab7e7e05
b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{"sub": "b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163", "email": "motorista@gmail", "email_verified": false, "phone_verified": false}	email	2026-04-15 21:16:30.822359+00	2026-04-15 21:16:30.822394+00	2026-04-15 21:16:30.822394+00	5903d33a-f6eb-4fa0-aa25-a9cda0a66fe5
dc1dd703-112a-4ac7-b947-2c81562896b7	dc1dd703-112a-4ac7-b947-2c81562896b7	{"sub": "dc1dd703-112a-4ac7-b947-2c81562896b7", "email": "contato@sk4r4n70.cloud", "email_verified": false, "phone_verified": false}	email	2026-04-19 19:26:17.078803+00	2026-04-19 19:26:17.078992+00	2026-04-19 19:26:17.078992+00	beee3aba-8c09-4a5b-a6f3-de4fa6d9b6b6
6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	{"sub": "6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e", "email": "felipe@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-04-19 19:28:38.287163+00	2026-04-19 19:28:38.287204+00	2026-04-19 19:28:38.287204+00	f5bf9ffa-a282-4995-a1be-ee43b56fef38
398ef1e1-3188-4897-a203-dc4f0e4bedda	398ef1e1-3188-4897-a203-dc4f0e4bedda	{"sub": "398ef1e1-3188-4897-a203-dc4f0e4bedda", "email": "ismael@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-04-19 19:29:53.76422+00	2026-04-19 19:29:53.764335+00	2026-04-19 19:29:53.764335+00	715756fd-b395-47b7-9c02-73d258b88d11
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
5475f761-cca7-44c3-bf56-da1fcafed203	967a5461-0a7c-4572-acc6-178fa03a3ca3	2026-04-15 16:58:43.97942+00	2026-04-15 16:58:43.97942+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	181.191.108.141	\N	\N	\N	\N	\N
61eb1364-07f1-4e3b-966e-c48a0f09ae1f	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 15:58:46.819394+00	2026-04-20 15:58:46.819394+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	181.191.110.130	\N	\N	\N	\N	\N
abda85ab-d20f-4b10-b02b-e0be6005158d	dc1dd703-112a-4ac7-b947-2c81562896b7	2026-04-21 17:24:41.785826+00	2026-04-21 17:24:41.785826+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	181.191.110.130	\N	\N	\N	\N	\N
954320ce-6251-450d-a2eb-2a30abba2fb0	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	2026-04-19 20:12:50.775877+00	2026-04-19 21:11:26.382458+00	\N	aal1	\N	2026-04-19 21:11:26.382383	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	181.191.110.130	\N	\N	\N	\N	\N
c0a50682-6338-4098-bd6c-537a0eff79d9	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 14:30:20.189535+00	2026-04-20 14:30:20.189535+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	181.191.108.141	\N	\N	\N	\N	\N
f967e083-d587-4149-bb45-c1e2b48a44d2	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 18:53:37.911035+00	2026-04-20 23:33:28.739899+00	\N	aal1	\N	2026-04-20 23:33:28.739803	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	181.191.110.130	\N	\N	\N	\N	\N
148e7754-cfeb-45b2-af58-5cf89e95e12e	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	2026-04-20 23:46:18.610798+00	2026-04-20 23:46:18.610798+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	181.191.110.130	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
5475f761-cca7-44c3-bf56-da1fcafed203	2026-04-15 16:58:43.988363+00	2026-04-15 16:58:43.988363+00	password	f59787b7-80ec-40ad-b075-c92c68e71a3e
c0a50682-6338-4098-bd6c-537a0eff79d9	2026-04-20 14:30:20.196222+00	2026-04-20 14:30:20.196222+00	password	8786009f-942b-4a0d-a77c-1c95f5baa053
61eb1364-07f1-4e3b-966e-c48a0f09ae1f	2026-04-20 15:58:46.826897+00	2026-04-20 15:58:46.826897+00	password	9ecb99b0-47ac-4120-9005-6a8425a52352
f967e083-d587-4149-bb45-c1e2b48a44d2	2026-04-20 18:53:37.935928+00	2026-04-20 18:53:37.935928+00	password	ab933458-3aac-493c-ac39-eff6045b5dfd
148e7754-cfeb-45b2-af58-5cf89e95e12e	2026-04-20 23:46:18.617559+00	2026-04-20 23:46:18.617559+00	password	e45f21c7-feaa-497b-8225-7e91cf0b0235
abda85ab-d20f-4b10-b02b-e0be6005158d	2026-04-21 17:24:41.803457+00	2026-04-21 17:24:41.803457+00	password	0a6e89ea-aae8-4dda-8279-446768739fe4
954320ce-6251-450d-a2eb-2a30abba2fb0	2026-04-19 20:12:50.783645+00	2026-04-19 20:12:50.783645+00	password	80e91b14-bad9-48a1-a342-113127341198
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	235	46gutquutoim	dc1dd703-112a-4ac7-b947-2c81562896b7	f	2026-04-21 17:24:41.795542+00	2026-04-21 17:24:41.795542+00	\N	abda85ab-d20f-4b10-b02b-e0be6005158d
00000000-0000-0000-0000-000000000000	63	wwecbyteksjf	967a5461-0a7c-4572-acc6-178fa03a3ca3	f	2026-04-15 16:58:43.984309+00	2026-04-15 16:58:43.984309+00	\N	5475f761-cca7-44c3-bf56-da1fcafed203
00000000-0000-0000-0000-000000000000	214	2fejbblh5raf	398ef1e1-3188-4897-a203-dc4f0e4bedda	f	2026-04-20 15:58:46.823617+00	2026-04-20 15:58:46.823617+00	\N	61eb1364-07f1-4e3b-966e-c48a0f09ae1f
00000000-0000-0000-0000-000000000000	224	z7rgcvw54rkl	398ef1e1-3188-4897-a203-dc4f0e4bedda	t	2026-04-20 21:26:09.565893+00	2026-04-20 23:33:28.735611+00	2nakgr7q5hwg	f967e083-d587-4149-bb45-c1e2b48a44d2
00000000-0000-0000-0000-000000000000	230	lwjcuayn45jx	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	f	2026-04-20 23:46:18.614355+00	2026-04-20 23:46:18.614355+00	\N	148e7754-cfeb-45b2-af58-5cf89e95e12e
00000000-0000-0000-0000-000000000000	153	6xze5zswfvi4	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	t	2026-04-19 20:12:50.78058+00	2026-04-19 21:11:26.378274+00	\N	954320ce-6251-450d-a2eb-2a30abba2fb0
00000000-0000-0000-0000-000000000000	155	nbl5pqgbcefa	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	f	2026-04-19 21:11:26.379402+00	2026-04-19 21:11:26.379402+00	6xze5zswfvi4	954320ce-6251-450d-a2eb-2a30abba2fb0
00000000-0000-0000-0000-000000000000	213	fioo4ikd57dv	398ef1e1-3188-4897-a203-dc4f0e4bedda	f	2026-04-20 14:30:20.193375+00	2026-04-20 14:30:20.193375+00	\N	c0a50682-6338-4098-bd6c-537a0eff79d9
00000000-0000-0000-0000-000000000000	215	2nakgr7q5hwg	398ef1e1-3188-4897-a203-dc4f0e4bedda	t	2026-04-20 18:53:37.923291+00	2026-04-20 21:26:09.563893+00	\N	f967e083-d587-4149-bb45-c1e2b48a44d2
00000000-0000-0000-0000-000000000000	227	xhauwfc2ph5q	398ef1e1-3188-4897-a203-dc4f0e4bedda	f	2026-04-20 23:33:28.736595+00	2026-04-20 23:33:28.736595+00	z7rgcvw54rkl	f967e083-d587-4149-bb45-c1e2b48a44d2
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: frotas; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.frotas (id, placa, modelo, ano, status, criado_em) FROM stdin;
\.


--
-- Data for Name: abastecimentos; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.abastecimentos (id, frota_id, litros, valor, data) FROM stdin;
\.


--
-- Data for Name: app_users; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.app_users (id, name, email, role, region, status, phone, vehicle, photo_url, auth_uid, created_at, password) FROM stdin;
2a78a694-7514-47d2-a5c7-9afee0e14630	Franqueado Salvador	franqueadosalvador.1776164640473@franquia.domempada.app	franqueado	Salvador	Ativo	tulio.r.scaranto@gmail.com	\N	\N	\N	2026-04-14 11:04:00.413298+00	123456
e5704053-eef1-4563-8301-072aa5072216	Franqueado teste	franqueadoteste.1776297848517@franquia.domempada.app	franqueado	Recife	Ativo	7ul105k4r4n70@gmail.com	\N	\N	\N	2026-04-16 00:04:09.372882+00	123456
0de9daf3-1d2a-4fd0-8d35-effbeb33004e	franqueado novo	franqueadonovo.1776297949785@franquia.domempada.app	franqueado	Recife	Ativo	7ul105k4r4n70@gmail.com	\N	\N	\N	2026-04-16 00:05:50.623868+00	123456
a762fc8c-5aa7-4284-876c-f8749877bfa2	Franqueado inicio	franqueadoinicio.1776297997079@franquia.domempada.app	franqueado	Recife	Ativo	7ul105k4r4n70@gmail.com	\N	\N	\N	2026-04-16 00:06:37.926915+00	123456
cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	motorista@gmail	motorista	Recife	Ativo	81996229931	\N	\N	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 16:31:43.539043+00	123456
d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	ismael@gmail.com	motorista	Recife	Ativo	81988792512		\N	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-19 19:29:54.034694+00	I123456r
80063de1-3d05-4bf6-83db-48c4076571c7	Gustavo Mesquita	gustavomesquita.1776463763712@franquia.domempada.app	franqueado	Recife	Ativo	8199245000	\N	\N	\N	2026-04-17 22:09:24.309409+00	G123456m
7dc5f0a1-d977-4e29-997b-d3c3691a7a48	TULIO ROBERTO SCARANTO	7ul105k4r4n70@gmail.com	admin	Recife	Ativo	81997627158		\N	967a5461-0a7c-4572-acc6-178fa03a3ca3	2026-04-15 16:29:19.072394+00	T05122020d*
1fcf8842-849a-48db-b0e4-503ef3f89063	Washington Felipe	felipe@gmail.com	motorista	Recife	Ativo	81985507879		\N	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	2026-04-19 19:28:42.132869+00	W123456f
22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	contato@sk4r4n70.cloud	motorista	Recife	Ativo	81991484777		\N	dc1dd703-112a-4ac7-b947-2c81562896b7	2026-04-19 19:26:21.305843+00	O123456a
\.


--
-- Data for Name: delivery_point_details; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.delivery_point_details (id, order_id, region, empadas_salgadas, empadas_doces, pasteis, pasteis_camarao, descartaveis, fardamentos, delivery_photo_url, created_at, updated_at) FROM stdin;
4608b9b1-fd61-48a1-a087-4f8f1dda1156	2286bd50-38eb-4e83-be0c-c2187f127f9a	Recife	0	0	0	0	{}	{}	http://72.60.61.216:8000/storage/v1/object/public/delivery-photos/delivery_2286bd50-38eb-4e83-be0c-c2187f127f9a_1776692372679.jpg	2026-04-20 13:39:33.275474+00	2026-04-20 13:39:33.275474+00
537c02e9-9b6e-452f-ab53-b3a7dffdaa20	60631049-54e3-4f6b-a129-b26abd0a9e2d	Recife	0	0	0	0	{}	{}	http://72.60.61.216:8000/storage/v1/object/public/delivery-photos/delivery_60631049-54e3-4f6b-a129-b26abd0a9e2d_1776720261949.jpg	2026-04-20 21:24:23.821934+00	2026-04-20 21:24:23.821934+00
ef1ffe14-8fcf-4b13-9c34-1f56afcd4a70	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	Recife	0	0	0	0	{}	{}	https://motorista.sk4r4n70.cloud/api/supabase/storage/v1/object/public/delivery-photos/delivery_8b6c527f-ae6d-489a-a64f-2e24a7aab1c1_1776729325241.jpg	2026-04-20 23:55:29.011747+00	2026-04-20 23:55:29.011747+00
a9752ebb-ee02-4aed-ac12-513d433b8ca3	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	Recife	0	0	0	0	{}	{}	https://motorista.sk4r4n70.cloud/api/supabase/storage/v1/object/public/delivery-photos/delivery_070bb0d9-7982-4500-9b6b-f9cdf60a9f3b_1776730521008.jpg	2026-04-21 00:15:22.504293+00	2026-04-21 00:15:22.504293+00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.orders (id, order_code, point_id, point_name, units, status, type, region, lat, lng, driver_name, vehicle, photo_url, status_history, created_at, franchisee_id, pdf_url, short_id, "deliveryPhoto", "driverPhoto", delivered_at, driver_id) FROM stdin;
618ccf26-5910-4edd-97cf-c2013aa86d2f	REC-LROGG	a3fcb5f7-39f9-45ff-be26-344b9fe08161	Sam´s Club Farol	340	COMPLETED	REGULAR	Recife	\N	\N	Oseas Arcanjo	\N	\N	[]	2026-04-18 17:20:15.004617+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	56	http://72.60.61.216:8000/storage/v1/object/public/delivery-photos/delivery_618ccf26-5910-4edd-97cf-c2013aa86d2f_1776639275091.jpg	\N	\N	\N
40067f97-bfcc-4699-9631-2de6b0b160e3	REC-OFQGU	a3fcb5f7-39f9-45ff-be26-344b9fe08161	Sam´s Club Farol	22	COMPLETED	REGULAR	Recife	\N	\N	Tulio Motorista	\N	\N	[]	2026-04-18 18:34:56.355259+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	60	\N	\N	\N	\N
86929984-e922-47b2-a296-4b7f178ed819	REC-PIEX7	501e3bb9-8fa9-4b08-b02e-2ced362094b7	Paulista	35	COMPLETED	REGULAR	Recife	\N	\N	Tulio Motorista	\N	\N	[]	2026-04-18 19:05:01.033932+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	65	\N	\N	\N	\N
63ade416-8aac-4d69-beb7-af0529043a29	REC-QJPBW	7117f71d-12b4-480e-9130-f7490c0dceff	ETC	327	IN_PROGRESS	REGULAR	Recife	\N	\N	Tulio Motorista	\N	\N	[]	2026-04-18 19:34:01.696654+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	68	\N	\N	\N	22da979a-4e00-48e8-8e0e-6654f8c590bc
f9e20155-b792-41b9-9a8c-fbdf577619d4	REC-PWEPU	6421eec3-b056-4169-98a9-c30a36e1c523	Parque Shopping Maceió	398	COMPLETED	REGULAR	Recife	\N	\N	Tulio Motorista	\N	\N	[]	2026-04-18 19:15:54.832257+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	66	http://72.60.61.216:8000/storage/v1/object/public/delivery-photos/delivery_f9e20155-b792-41b9-9a8c-fbdf577619d4_1776557594670.jpg	\N	\N	\N
36393c51-9bc7-41bf-b1d3-9df3846304b1	REC-OBSHU	a3fcb5f7-39f9-45ff-be26-344b9fe08161	Sam´s Club Farol	26	IN PROGRESS	REGULAR	Recife	\N	\N	Tulio Motorista	\N	\N	[]	2026-04-18 18:31:52.339132+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	59	\N	\N	\N	\N
176ef928-7a69-410c-969d-5c635a3f78d6	REC-QTUGU	3ce5aa33-f5ed-47a5-aa5c-5ec19f5b5b07	Shopping Pátio	4	IN PROGRESS	REGULAR	Recife	\N	\N	Tulio Motorista	\N	\N	[]	2026-04-18 19:41:54.007926+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	70	\N	\N	\N	\N
bb55bcd5-ef7b-49b8-b607-aaac32426212	REC-HI9QQ	3ce5aa33-f5ed-47a5-aa5c-5ec19f5b5b07	Shopping Pátio	112	IN PROGRESS	REGULAR	Recife	\N	\N	Oseas Arcanjo	\N	\N	[]	2026-04-17 22:33:11.164006+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	55	\N	\N	\N	\N
25273826-dcfd-4f98-93d5-07ab29e6a9f5	REC-P0O5F	501e3bb9-8fa9-4b08-b02e-2ced362094b7	Paulista	31	COMPLETED	REGULAR	Recife	\N	\N	Oseas Arcanjo	\N	\N	[]	2026-04-18 18:51:13.155468+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	63	http://72.60.61.216:8000/storage/v1/object/public/delivery-photos/delivery_25273826-dcfd-4f98-93d5-07ab29e6a9f5_1776641687245.jpg	\N	\N	\N
93ca8de4-4817-4e26-b2e0-0768f8265d06	REC-R1L3W	3ce5aa33-f5ed-47a5-aa5c-5ec19f5b5b07	Shopping Pátio	8	IN_PROGRESS	REGULAR	Recife	\N	\N	Tulio Motorista	\N	\N	[]	2026-04-18 19:47:55.648415+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	71	\N	\N	\N	22da979a-4e00-48e8-8e0e-6654f8c590bc
836b91b8-29a4-45f7-ba66-b4d9c76b7364	REC-MUL9Y	a3fcb5f7-39f9-45ff-be26-344b9fe08161	Sam´s Club Farol	18	COMPLETED	REGULAR	Recife	\N	\N	Ismael Rodrigues	\N	\N	[]	2026-04-18 17:50:30.069272+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	57	\N	\N	\N	\N
60631049-54e3-4f6b-a129-b26abd0a9e2d	REC-QMVEQ	3ce5aa33-f5ed-47a5-aa5c-5ec19f5b5b07	Shopping Pátio	17	COMPLETED	REGULAR	Recife	\N	\N	Test Driver	\N	\N	[]	2026-04-18 19:36:28.640488+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	69	http://test.com/photo.jpg	\N	2026-04-20 22:10:25.459+00	22da979a-4e00-48e8-8e0e-6654f8c590bc
2286bd50-38eb-4e83-be0c-c2187f127f9a	REC-OUTXB	501e3bb9-8fa9-4b08-b02e-2ced362094b7	Paulista	28	COMPLETED	REGULAR	Recife	\N	\N	Ismael Rodrigues	\N	\N	[]	2026-04-18 18:46:40.698961+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	62	\N	\N	2026-04-20 13:39:33.275474+00	\N
50236454-7014-430c-bf83-532857700366	REC-NK1D9	a3fcb5f7-39f9-45ff-be26-344b9fe08161	Sam´s Club Farol	10	COMPLETED	REGULAR	Recife	\N	\N	Ismael Rodrigues	\N	\N	[]	2026-04-18 18:10:17.340226+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	58	\N	\N	\N	\N
b99c0f5a-fd87-49f1-ac96-b790b51ed696	REC-OQ7UO	501e3bb9-8fa9-4b08-b02e-2ced362094b7	Paulista	35	COMPLETED	REGULAR	Recife	\N	\N	Ismael Rodrigues	\N	\N	[]	2026-04-18 18:43:05.487087+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	61	\N	\N	\N	\N
8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	REC-PCSEZ	501e3bb9-8fa9-4b08-b02e-2ced362094b7	Paulista	28	COMPLETED	REGULAR	Recife	\N	\N		\N	\N	[]	2026-04-18 19:00:38.562075+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	64	\N	\N	\N	\N
070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	REC-QBAZ4	3ce5aa33-f5ed-47a5-aa5c-5ec19f5b5b07	Shopping Pátio	341	COMPLETED	REGULAR	Recife	\N	\N		\N	\N	[]	2026-04-18 19:27:29.332457+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	67	\N	\N	\N	\N
e8677825-253e-4998-941f-dc93367d09dc	REC-695EZ	3ce5aa33-f5ed-47a5-aa5c-5ec19f5b5b07	Shopping Pátio	16	IDLE	REGULAR	Recife	\N	\N	\N	\N	\N	[]	2026-04-21 05:17:00.529075+00	80063de1-3d05-4bf6-83db-48c4076571c7	\N	72	\N	\N	\N	\N
\.


--
-- Data for Name: delivery_products; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.delivery_products (id, order_id, product_id, product_name, category, quantity, driver_id, driver_name, point_name, order_code, region, delivered_at) FROM stdin;
d2d261af-eecf-44cd-965d-6025997403c0	40067f97-bfcc-4699-9631-2de6b0b160e3	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	25	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
00030dab-684a-4c18-a749-45214c210f7c	40067f97-bfcc-4699-9631-2de6b0b160e3	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
a9553570-9d51-4588-b194-030525cc0cdc	40067f97-bfcc-4699-9631-2de6b0b160e3	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	32	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
9bd4c79e-9d74-41cc-b7f7-8640bb20586e	40067f97-bfcc-4699-9631-2de6b0b160e3	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
416b77c1-27b2-457c-9507-5fb2c6b44e4e	40067f97-bfcc-4699-9631-2de6b0b160e3	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	5	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
73ddde23-139f-4cb5-93b2-97eb27f5e474	40067f97-bfcc-4699-9631-2de6b0b160e3	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
adea187c-0994-461f-be58-ee64d0385d02	40067f97-bfcc-4699-9631-2de6b0b160e3	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	4	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
898bb0b4-9040-47db-a04b-8834ad78572c	40067f97-bfcc-4699-9631-2de6b0b160e3	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	9	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
97320d6f-85e2-424d-8752-9e009c259bbb	40067f97-bfcc-4699-9631-2de6b0b160e3	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	6	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
73483131-7cd3-4c26-840b-a563178c57c7	40067f97-bfcc-4699-9631-2de6b0b160e3	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	12	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
0d6bfab5-613e-4c90-87f4-ddba1198a570	40067f97-bfcc-4699-9631-2de6b0b160e3	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
f21771f1-a7b7-43ae-b0c3-d693edbd8b88	40067f97-bfcc-4699-9631-2de6b0b160e3	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	6	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
18a2d98a-56b5-4e67-8468-439ddf8acfb5	40067f97-bfcc-4699-9631-2de6b0b160e3	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	60	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
83969f38-e39b-492b-9a9b-90e85019ba3f	40067f97-bfcc-4699-9631-2de6b0b160e3	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	54	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
ad4a7b22-41fd-42ae-b67f-bfed2feac438	40067f97-bfcc-4699-9631-2de6b0b160e3	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
4545c5b3-c5d2-4b1d-adac-d290fa23cf8e	40067f97-bfcc-4699-9631-2de6b0b160e3	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
9099e15a-9291-4566-83e2-4c0fd0e3448e	40067f97-bfcc-4699-9631-2de6b0b160e3	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
2788044d-3243-41a9-91b4-5368a4a83034	40067f97-bfcc-4699-9631-2de6b0b160e3	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
bf6fafa6-a1f8-4b7c-b280-c142c9279cd7	40067f97-bfcc-4699-9631-2de6b0b160e3	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
3fae66be-a8ca-4e3f-9e3c-30177a600d2a	40067f97-bfcc-4699-9631-2de6b0b160e3	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	12	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
e4057ae4-1795-4827-9c50-8c19717c755d	40067f97-bfcc-4699-9631-2de6b0b160e3	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
1ad0e211-e363-495e-b657-a62409ce1c2a	40067f97-bfcc-4699-9631-2de6b0b160e3	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
b4cd8f15-41da-4116-ab6f-7885bd992f20	40067f97-bfcc-4699-9631-2de6b0b160e3	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
ff66c9af-faee-4c9c-bb23-45063a76a40b	40067f97-bfcc-4699-9631-2de6b0b160e3	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
4577e77f-8368-456a-89af-ce1ed0b2061c	40067f97-bfcc-4699-9631-2de6b0b160e3	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	4	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
a382d1c1-ed5b-49c8-ad3d-bb086d30e892	40067f97-bfcc-4699-9631-2de6b0b160e3	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	5	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
0789e1ea-a095-4324-810a-ec3010702651	40067f97-bfcc-4699-9631-2de6b0b160e3	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	67	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
1f36d2e3-49fd-4406-bd6c-3338e3fb67e0	40067f97-bfcc-4699-9631-2de6b0b160e3	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	8	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
e773a471-4e5a-44b6-95e6-7f18eb5e77a1	40067f97-bfcc-4699-9631-2de6b0b160e3	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	9	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Sam´s Club Farol	REC-OFQGU	Recife	2026-04-18 23:38:57.742889+00
75e556f5-fd51-4434-ad8a-c043f25d1b13	86929984-e922-47b2-a296-4b7f178ed819	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
c6bcb6ac-b8e6-476d-b2ec-aea7a2ba5d43	86929984-e922-47b2-a296-4b7f178ed819	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
e4657a53-04a3-4e36-acfa-7b1b007faeab	86929984-e922-47b2-a296-4b7f178ed819	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
929be61b-e02e-4e53-8ca0-0627f7124354	86929984-e922-47b2-a296-4b7f178ed819	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	4	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
896f4c41-8fd8-49b2-8720-80d21c46497a	86929984-e922-47b2-a296-4b7f178ed819	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	5	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
c2112db9-23d4-4bdd-8932-6a75fb88a4c3	86929984-e922-47b2-a296-4b7f178ed819	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
34d18f6c-b918-430c-99a0-b3ec70668da7	86929984-e922-47b2-a296-4b7f178ed819	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	7	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
eb650158-7ffe-4ab0-be50-fbed2ee90227	86929984-e922-47b2-a296-4b7f178ed819	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	8	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
1a714254-8234-447a-bcb8-d78e5cf665c2	86929984-e922-47b2-a296-4b7f178ed819	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	9	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
4c4a118a-870b-42d8-a18e-a0c2e10db38e	86929984-e922-47b2-a296-4b7f178ed819	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	4	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
cc5c3be0-288c-47f6-98bc-5dd11e8e4b73	86929984-e922-47b2-a296-4b7f178ed819	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
c1c6341e-549d-4762-a4ad-da9dd164d0ce	86929984-e922-47b2-a296-4b7f178ed819	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
7ce5d2dc-c8ea-4f6a-ad8d-e649e5c33d98	86929984-e922-47b2-a296-4b7f178ed819	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	4	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
a57e3dba-ce17-40e4-9346-aa6a7942c496	86929984-e922-47b2-a296-4b7f178ed819	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	5	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
a12c4df0-67c7-4bf7-997b-10f8e7eb5ae8	86929984-e922-47b2-a296-4b7f178ed819	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	6	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
c19054f6-f7c4-4fcb-9151-81ae7c0e2b74	86929984-e922-47b2-a296-4b7f178ed819	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	7	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
03d65c90-7430-494c-bcca-73456e3e1798	86929984-e922-47b2-a296-4b7f178ed819	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	8	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
10ffd6a3-c932-4259-a2ae-8e0790a26f8b	86929984-e922-47b2-a296-4b7f178ed819	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	9	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
7f209b9d-71f0-4622-a453-844a147d26e1	86929984-e922-47b2-a296-4b7f178ed819	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
dab97c18-d98c-4c9e-bf7b-1981b5b4b7a4	86929984-e922-47b2-a296-4b7f178ed819	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
24ed4622-4ed5-453f-bb20-77486fe1956b	86929984-e922-47b2-a296-4b7f178ed819	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
d298eab1-1dc4-4343-a1a3-bce72fbd5c10	86929984-e922-47b2-a296-4b7f178ed819	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	4	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
0bf8b9fd-f498-45c7-a774-9db7ac4ad72a	86929984-e922-47b2-a296-4b7f178ed819	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	56	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
860e70c8-5b7a-4277-8eb9-745b6c3df8bf	86929984-e922-47b2-a296-4b7f178ed819	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	7	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
4b5ce1a1-449e-4c4f-a7ce-c6c2eeb417a2	86929984-e922-47b2-a296-4b7f178ed819	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	89	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
e89e2f60-204a-4314-a025-73ee262f5635	86929984-e922-47b2-a296-4b7f178ed819	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	5	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
915a6687-59ba-4c94-9b00-f4d2db8949f8	86929984-e922-47b2-a296-4b7f178ed819	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	4	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
7695380a-638b-4df4-8b17-0c5ad58f6d22	86929984-e922-47b2-a296-4b7f178ed819	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	6	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
c3219eff-72a8-4ae2-be67-581a7563cc76	86929984-e922-47b2-a296-4b7f178ed819	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	12	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
054235f2-c63e-45e1-bc72-95bf1aa0f56d	86929984-e922-47b2-a296-4b7f178ed819	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	7	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Paulista	REC-PIEX7	Recife	2026-04-18 23:50:44.844639+00
07a4f22a-f05b-4da6-9cd8-4843dd806e6c	f9e20155-b792-41b9-9a8c-fbdf577619d4	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	20	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
3680eeb7-1ab8-4b3e-b5a5-bd321b179ad3	f9e20155-b792-41b9-9a8c-fbdf577619d4	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
89e24f14-a415-463b-b256-bec3062afcfa	f9e20155-b792-41b9-9a8c-fbdf577619d4	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
3c58cbe5-09c9-4ca2-b65d-58304308b595	f9e20155-b792-41b9-9a8c-fbdf577619d4	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
469c8128-9a9e-4b27-be8d-e82ed3c7cd23	f9e20155-b792-41b9-9a8c-fbdf577619d4	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
0e70ec29-51ef-48ab-acbb-c0abc0efb934	f9e20155-b792-41b9-9a8c-fbdf577619d4	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
92b58a0a-6b4d-405d-994a-f429f8b0e158	f9e20155-b792-41b9-9a8c-fbdf577619d4	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
6e83e613-8f6d-4e6d-9dca-fbe2c55cfd21	f9e20155-b792-41b9-9a8c-fbdf577619d4	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
67323ee3-7b4d-4c6b-98c9-5c2e61c2234c	f9e20155-b792-41b9-9a8c-fbdf577619d4	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
fe97b1c5-f278-4c73-b3b4-48c61481509f	f9e20155-b792-41b9-9a8c-fbdf577619d4	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
71c2589c-3a85-4f34-99c9-56853da35d1e	f9e20155-b792-41b9-9a8c-fbdf577619d4	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
deff6ddd-f966-454a-96ed-0236c9952ab5	f9e20155-b792-41b9-9a8c-fbdf577619d4	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	32	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
d76fff99-842b-43b7-9f36-36b3aa2bad39	f9e20155-b792-41b9-9a8c-fbdf577619d4	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
97324e8d-cac3-48bf-8ba0-7f10e6c0f109	f9e20155-b792-41b9-9a8c-fbdf577619d4	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	32	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
db4eb15c-5a65-4ac3-a083-bc4f22b974b3	f9e20155-b792-41b9-9a8c-fbdf577619d4	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
6b8ed5ea-e5b7-4916-a584-8a2d90be238a	f9e20155-b792-41b9-9a8c-fbdf577619d4	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
a9bed862-9346-41b8-be6c-7c9c488860a8	f9e20155-b792-41b9-9a8c-fbdf577619d4	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
c17d2046-a9ed-41f8-b64e-a59a7569c1fa	f9e20155-b792-41b9-9a8c-fbdf577619d4	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
12df9105-009f-4aa8-a56d-cca4274e91ab	f9e20155-b792-41b9-9a8c-fbdf577619d4	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
c02bced0-4761-41f9-bda0-ed127f8faa02	f9e20155-b792-41b9-9a8c-fbdf577619d4	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
715d6a61-8942-4297-9978-3e6c8a059534	f9e20155-b792-41b9-9a8c-fbdf577619d4	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
cb7ca5fd-94c6-4767-be17-ab6e88f1b37f	f9e20155-b792-41b9-9a8c-fbdf577619d4	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
21e0531d-da1f-42a2-8096-3a7ad83bfb38	f9e20155-b792-41b9-9a8c-fbdf577619d4	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
eb329083-b860-4b53-82f8-12f9d63e9cb9	f9e20155-b792-41b9-9a8c-fbdf577619d4	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	23	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
169e7abb-76b6-45a9-83a3-b1e7bb310145	f9e20155-b792-41b9-9a8c-fbdf577619d4	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
401b67df-980f-48c9-b3f9-19030350c94f	f9e20155-b792-41b9-9a8c-fbdf577619d4	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
0df25c8c-97e3-4028-ae94-5f73dbac479d	f9e20155-b792-41b9-9a8c-fbdf577619d4	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	1	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
fc9f9eec-1e85-4e18-90bd-537aa359a2bc	f9e20155-b792-41b9-9a8c-fbdf577619d4	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	2	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
25a4991a-e9f5-4e98-994f-fdbc76a8a7e0	f9e20155-b792-41b9-9a8c-fbdf577619d4	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	3	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Parque Shopping Maceió	REC-PWEPU	Recife	2026-04-19 00:13:15.32694+00
fc2c9c8e-bbcf-44a6-a62d-c28a4a16b30b	618ccf26-5910-4edd-97cf-c2013aa86d2f	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	20	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
97c9bf56-23b6-4212-bfe5-fdaf48fb0189	618ccf26-5910-4edd-97cf-c2013aa86d2f	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	5	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
8b833526-46c2-4fb6-b026-9fc9fee641de	618ccf26-5910-4edd-97cf-c2013aa86d2f	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	1	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
d3f961e3-6100-4f42-a52f-6f01d1897f67	618ccf26-5910-4edd-97cf-c2013aa86d2f	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
45714a48-11d8-4f9b-bd08-d108b6ee767b	618ccf26-5910-4edd-97cf-c2013aa86d2f	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
3bbd4f20-4dde-430f-818c-83d5d6881394	618ccf26-5910-4edd-97cf-c2013aa86d2f	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	9	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
e177a003-4329-45fc-bb67-575fd53f794d	618ccf26-5910-4edd-97cf-c2013aa86d2f	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	7	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
a352e1cc-107c-4330-b713-e68ec8013b20	618ccf26-5910-4edd-97cf-c2013aa86d2f	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	8	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
97aa0b66-7a6d-46fd-8434-be3343fb3296	618ccf26-5910-4edd-97cf-c2013aa86d2f	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	9	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
e61df1a0-470a-4d2d-9d48-6998cf92be0d	618ccf26-5910-4edd-97cf-c2013aa86d2f	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
433ac27c-5ff4-4033-8fd4-3e1bffe30452	618ccf26-5910-4edd-97cf-c2013aa86d2f	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	5	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
18173f6a-276c-4954-bf96-3b2aebe5924b	618ccf26-5910-4edd-97cf-c2013aa86d2f	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	4	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
558bcda5-9e4d-4f3b-9e84-163c726f7449	618ccf26-5910-4edd-97cf-c2013aa86d2f	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	1	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
02ef3d9b-649e-42f9-aea3-8ae91974b993	618ccf26-5910-4edd-97cf-c2013aa86d2f	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
ec8d026f-8c26-4c7f-8000-82f9da339e06	618ccf26-5910-4edd-97cf-c2013aa86d2f	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
6f5e560a-f0f5-4b8e-a8ec-5dd196b8255a	618ccf26-5910-4edd-97cf-c2013aa86d2f	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
577d0680-d19e-4264-ad8f-115e5b6e9274	618ccf26-5910-4edd-97cf-c2013aa86d2f	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	1	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
fb0667b6-9fe2-429d-80ac-82c1524f4ae1	618ccf26-5910-4edd-97cf-c2013aa86d2f	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
4993c0cb-a7ea-4294-a2b2-2448055cbd69	618ccf26-5910-4edd-97cf-c2013aa86d2f	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	5	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
c6360469-c468-46a0-8356-3c0adb61d351	618ccf26-5910-4edd-97cf-c2013aa86d2f	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	8	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
8b65394f-55d1-4951-85e1-98a7d3f143bc	618ccf26-5910-4edd-97cf-c2013aa86d2f	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	9	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
84f71a19-3928-463b-97e2-0bab365771a7	618ccf26-5910-4edd-97cf-c2013aa86d2f	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
b77bbc99-0b34-4ca0-99c0-243fef34dae9	618ccf26-5910-4edd-97cf-c2013aa86d2f	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
16159e56-c655-4798-9384-94bf0c501b23	618ccf26-5910-4edd-97cf-c2013aa86d2f	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
640d7635-ae91-4131-a7c1-983aed79b7d1	618ccf26-5910-4edd-97cf-c2013aa86d2f	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	1	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
751776b8-7beb-4556-bb52-b14b40308920	618ccf26-5910-4edd-97cf-c2013aa86d2f	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
3d5f8b6a-e561-467f-bc74-2e1567ff0511	618ccf26-5910-4edd-97cf-c2013aa86d2f	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
b41fd9fb-2ce1-4273-a3a3-a4f7408b00d9	618ccf26-5910-4edd-97cf-c2013aa86d2f	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
e8600b5b-4a54-4794-aecd-84fcff3995b5	618ccf26-5910-4edd-97cf-c2013aa86d2f	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	5	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
2a8c7213-c6ad-47bc-b905-8177942f8bf2	618ccf26-5910-4edd-97cf-c2013aa86d2f	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	5	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
95dd3a14-bdd2-4feb-99dc-52a2bd90acf1	618ccf26-5910-4edd-97cf-c2013aa86d2f	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Sam´s Club Farol	REC-LROGG	Recife	2026-04-19 22:54:35.458531+00
47d46ae6-9ce5-4e98-910c-4eaa4796ddd1	25273826-dcfd-4f98-93d5-07ab29e6a9f5	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	5	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
0a87d7b0-1acf-4d77-ac6c-96df2c975b34	25273826-dcfd-4f98-93d5-07ab29e6a9f5	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	22	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
1d6fbbcc-3300-43a0-b33d-77c4b5998b89	25273826-dcfd-4f98-93d5-07ab29e6a9f5	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
b113512a-6f0e-4436-ba38-98e10cebd488	25273826-dcfd-4f98-93d5-07ab29e6a9f5	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
d753ffac-d060-4e36-ae78-e48b5ce2e8df	25273826-dcfd-4f98-93d5-07ab29e6a9f5	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
e1107b08-705a-4ec8-84c7-5c4ffdbbb2a6	25273826-dcfd-4f98-93d5-07ab29e6a9f5	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
b94eb0b3-b4ad-4464-8609-f719b6e886bd	25273826-dcfd-4f98-93d5-07ab29e6a9f5	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
c38b1e1d-4bf2-4bb0-bc1e-80804d2cd0b4	25273826-dcfd-4f98-93d5-07ab29e6a9f5	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	1	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
2e4884be-c816-48ac-8bc8-e2a1d25b876d	25273826-dcfd-4f98-93d5-07ab29e6a9f5	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	1	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
79fe9b7a-258b-4fb7-993b-bfdc84c0a05b	25273826-dcfd-4f98-93d5-07ab29e6a9f5	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
608c0bd4-8594-46d1-b22d-2155881be291	25273826-dcfd-4f98-93d5-07ab29e6a9f5	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
37883fa3-ae5a-4994-85b8-f0ae0892c47f	25273826-dcfd-4f98-93d5-07ab29e6a9f5	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
48163fae-73d0-407b-9c90-cd7e7f5bca29	25273826-dcfd-4f98-93d5-07ab29e6a9f5	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
5449f0b8-1bde-49c8-8812-f51f674c946f	25273826-dcfd-4f98-93d5-07ab29e6a9f5	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
d848ddd7-0858-4d9b-9ccb-2fc7495e92d1	25273826-dcfd-4f98-93d5-07ab29e6a9f5	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
59bb1387-9208-4767-b8dc-f9771d3a2987	25273826-dcfd-4f98-93d5-07ab29e6a9f5	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
8a0292c9-3c8b-49c4-b06b-01bf0450fa9b	25273826-dcfd-4f98-93d5-07ab29e6a9f5	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
94b2326c-71c7-4496-8ec2-e99015ba6af0	25273826-dcfd-4f98-93d5-07ab29e6a9f5	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
4e46cecf-fcba-4808-a8cb-624bce024a4f	25273826-dcfd-4f98-93d5-07ab29e6a9f5	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
3f8b0280-a8b6-4791-b523-fbea296515bb	25273826-dcfd-4f98-93d5-07ab29e6a9f5	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
7adb4167-e9b5-439c-8ba3-946269961ec1	25273826-dcfd-4f98-93d5-07ab29e6a9f5	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
a0dc0a1c-ba10-44d5-a196-19876c1f4537	25273826-dcfd-4f98-93d5-07ab29e6a9f5	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
9231ee55-2404-4d75-807a-a53ed06f7fcd	25273826-dcfd-4f98-93d5-07ab29e6a9f5	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
4c0274d3-6a0d-4b50-89a1-678afdd0bbd9	25273826-dcfd-4f98-93d5-07ab29e6a9f5	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
19e32740-6bb4-4572-b9ab-dbd7e1b9e815	25273826-dcfd-4f98-93d5-07ab29e6a9f5	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
1f09246a-7ec7-4efb-bc66-255522a2d0bb	25273826-dcfd-4f98-93d5-07ab29e6a9f5	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
6c73b63b-8568-4a72-9e8d-a89442d876cb	25273826-dcfd-4f98-93d5-07ab29e6a9f5	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
8c952c6e-95d0-441b-81e0-5be6dc1c58e6	25273826-dcfd-4f98-93d5-07ab29e6a9f5	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
f5625ca5-47cf-465e-b106-b0b63ad08304	25273826-dcfd-4f98-93d5-07ab29e6a9f5	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
8843101c-59a7-41b2-ba9a-eb09610e8559	25273826-dcfd-4f98-93d5-07ab29e6a9f5	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:29:51.282+00
e43df6f7-a9a0-4c5d-b3e3-bcb7cbff6571	25273826-dcfd-4f98-93d5-07ab29e6a9f5	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	5	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
80af4ecc-ed92-42fe-b942-31217e5eb8f7	25273826-dcfd-4f98-93d5-07ab29e6a9f5	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	22	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
a7b8e99b-95f5-4c75-a405-d77c0fac58d3	25273826-dcfd-4f98-93d5-07ab29e6a9f5	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
c33ecb88-6731-44b0-af49-8dd564a231fc	25273826-dcfd-4f98-93d5-07ab29e6a9f5	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
67367583-8e16-4490-8739-d116fecba804	25273826-dcfd-4f98-93d5-07ab29e6a9f5	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
cda11ddb-8d55-4ea3-a5f5-ba15323eee6d	25273826-dcfd-4f98-93d5-07ab29e6a9f5	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
4ceab8e8-f99f-417d-92fe-635d059674b2	25273826-dcfd-4f98-93d5-07ab29e6a9f5	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
c8eb3e48-4cd8-424e-80da-bb544773b936	25273826-dcfd-4f98-93d5-07ab29e6a9f5	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	1	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
101292e0-05c6-4ad5-8c28-d0f7ad56f7c6	25273826-dcfd-4f98-93d5-07ab29e6a9f5	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	1	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
2b600f8d-518c-419c-8f93-67adb0321a7b	25273826-dcfd-4f98-93d5-07ab29e6a9f5	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
ccb65631-e62f-4ad7-a285-49331108b431	25273826-dcfd-4f98-93d5-07ab29e6a9f5	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
62306ee3-677f-40ab-98fb-077e02bb32be	25273826-dcfd-4f98-93d5-07ab29e6a9f5	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
4b7356c0-7809-4d06-b971-4761076f6ca8	25273826-dcfd-4f98-93d5-07ab29e6a9f5	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
99619085-4e66-40d8-92ae-a60d23feabb0	25273826-dcfd-4f98-93d5-07ab29e6a9f5	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
ae7dc33a-f8e4-404e-b695-8f5380639b42	25273826-dcfd-4f98-93d5-07ab29e6a9f5	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
b74b3b47-f1a1-49f1-a88d-071d92980c3f	25273826-dcfd-4f98-93d5-07ab29e6a9f5	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
7be05145-14a0-49f9-b1b1-b5f64c03b3d9	25273826-dcfd-4f98-93d5-07ab29e6a9f5	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
9613f088-2766-4bbc-801f-1b395ea3ab72	25273826-dcfd-4f98-93d5-07ab29e6a9f5	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
291d1bf7-5f59-4d9f-97fb-3404b6e0c772	25273826-dcfd-4f98-93d5-07ab29e6a9f5	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
c9bbcbfa-ea06-439c-99bb-526ab2835a33	25273826-dcfd-4f98-93d5-07ab29e6a9f5	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
373d4472-f434-45d2-a387-073f8e6a3b41	25273826-dcfd-4f98-93d5-07ab29e6a9f5	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
cf166747-e604-417d-8111-032912e67be9	25273826-dcfd-4f98-93d5-07ab29e6a9f5	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
b28685b3-00e9-4ce4-a357-2f5d3821b3f1	25273826-dcfd-4f98-93d5-07ab29e6a9f5	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
c723ee19-bc8e-479f-aac4-b139c26aed2b	25273826-dcfd-4f98-93d5-07ab29e6a9f5	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
50d45de6-3f0a-4ad5-8153-cf3767284d44	25273826-dcfd-4f98-93d5-07ab29e6a9f5	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
9af320ec-db62-4717-b2f9-77193416ff63	25273826-dcfd-4f98-93d5-07ab29e6a9f5	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
209dc425-073e-4252-8cf5-2a2814c33434	25273826-dcfd-4f98-93d5-07ab29e6a9f5	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
9d964869-b8be-413c-be70-51d528fcf859	25273826-dcfd-4f98-93d5-07ab29e6a9f5	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
bf7df1cf-0498-4ef2-8384-0b6fada6555d	25273826-dcfd-4f98-93d5-07ab29e6a9f5	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
5aa6751e-38ce-45d7-ac83-817dd512b4ce	25273826-dcfd-4f98-93d5-07ab29e6a9f5	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Paulista	REC-P0O5F	Recife	2026-04-19 23:34:47.073+00
1af7a262-86aa-494f-9d79-e3357c2ad162	836b91b8-29a4-45f7-ba66-b4d9c76b7364	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
6748d00a-28d3-40bd-9acb-111ab60f4c76	836b91b8-29a4-45f7-ba66-b4d9c76b7364	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
70686f38-17d2-4818-80f3-967fdb3e2c57	836b91b8-29a4-45f7-ba66-b4d9c76b7364	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
1b9617b4-5f64-4278-aebf-c35a9ec6c994	836b91b8-29a4-45f7-ba66-b4d9c76b7364	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
a4016e17-f1c8-4a01-b9a1-5097604335e3	836b91b8-29a4-45f7-ba66-b4d9c76b7364	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
4b98027e-fe0b-4444-b427-0526c5bbe2d4	836b91b8-29a4-45f7-ba66-b4d9c76b7364	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
fd969542-d7a4-47bc-b497-d7195bbdfec3	836b91b8-29a4-45f7-ba66-b4d9c76b7364	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	7	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
85b9dc9c-dab4-41ef-9c98-2804e64ca727	836b91b8-29a4-45f7-ba66-b4d9c76b7364	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
d43c5d55-7afb-4a3f-972f-046d09d27762	836b91b8-29a4-45f7-ba66-b4d9c76b7364	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
b793359a-af72-4da3-a7fd-85c2cc405b6b	836b91b8-29a4-45f7-ba66-b4d9c76b7364	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
f2d4447a-4332-49cf-8d2a-550b5c99c3b1	836b91b8-29a4-45f7-ba66-b4d9c76b7364	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
e37a284a-0ffa-4d46-af7d-6528db8ee491	836b91b8-29a4-45f7-ba66-b4d9c76b7364	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
85487b7f-7b5b-4907-8b78-87efce0ebf5b	836b91b8-29a4-45f7-ba66-b4d9c76b7364	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
9299150b-4b01-430d-a0bd-0596a3392640	836b91b8-29a4-45f7-ba66-b4d9c76b7364	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
ef382c6b-a2cc-482c-9722-5cc8f6b6abe5	836b91b8-29a4-45f7-ba66-b4d9c76b7364	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
5858f9b5-3aef-4bf6-887d-a83857901615	836b91b8-29a4-45f7-ba66-b4d9c76b7364	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
fe8682cd-dea1-4825-90e6-cb84dc76b4a5	836b91b8-29a4-45f7-ba66-b4d9c76b7364	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
8cf807b1-06c8-486f-941f-11619b8de5f9	836b91b8-29a4-45f7-ba66-b4d9c76b7364	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
6389ebde-81bd-4a31-b732-dd1ae55b3974	836b91b8-29a4-45f7-ba66-b4d9c76b7364	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
5d5ee9ad-69e4-47ee-bf71-ba8692245b0c	836b91b8-29a4-45f7-ba66-b4d9c76b7364	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	7	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
e85ad613-1dc6-48c1-98e2-b25f14ae9f7b	836b91b8-29a4-45f7-ba66-b4d9c76b7364	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
f4d46ba2-18bc-4383-9492-36a6257dd903	836b91b8-29a4-45f7-ba66-b4d9c76b7364	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
2c78a072-fb2f-4e2a-9618-f6e16c156e67	836b91b8-29a4-45f7-ba66-b4d9c76b7364	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
74d4601e-d991-494a-8464-db1430f96392	836b91b8-29a4-45f7-ba66-b4d9c76b7364	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
f915f45a-f042-435f-8686-5d87bec45f23	836b91b8-29a4-45f7-ba66-b4d9c76b7364	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
62af539c-8ff4-4975-8042-cb7cb5bdc8ae	836b91b8-29a4-45f7-ba66-b4d9c76b7364	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
96198163-199e-48e4-a030-64fae7788fbb	836b91b8-29a4-45f7-ba66-b4d9c76b7364	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
d8baa1a6-e119-46a6-9197-7ac69352b110	836b91b8-29a4-45f7-ba66-b4d9c76b7364	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
ae64dc92-77c0-468e-ac8e-decde46896cf	836b91b8-29a4-45f7-ba66-b4d9c76b7364	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
fc9f94f4-8f9d-485c-8dda-03f66f5f7aae	836b91b8-29a4-45f7-ba66-b4d9c76b7364	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-MUL9Y	Recife	2026-04-20 10:18:48.858+00
54262025-7e13-44b3-99f0-98fe20e90658	50236454-7014-430c-bf83-532857700366	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	56	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
eb28652b-9b3e-46d6-b52f-c5dde51a59dc	50236454-7014-430c-bf83-532857700366	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
fe068d85-54d3-41cb-9e79-e63ba3662d55	50236454-7014-430c-bf83-532857700366	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
2410c498-baae-43c1-bfb7-2db09cd47a29	50236454-7014-430c-bf83-532857700366	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
19b2a4c0-3ce1-4dff-9bc2-51d3272b2899	50236454-7014-430c-bf83-532857700366	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	7	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
68a7de70-c980-4601-8050-40e1b39ded61	50236454-7014-430c-bf83-532857700366	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
1fc68f2c-6b33-4265-b0cf-ceb57f4674e3	50236454-7014-430c-bf83-532857700366	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
faf3d1bb-50c0-4409-8100-d2f6f7b5ec13	50236454-7014-430c-bf83-532857700366	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
30125716-bb9c-462b-8f26-35935e9f5259	50236454-7014-430c-bf83-532857700366	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
9a12e6d6-e428-4633-b929-b82a8b721d4d	50236454-7014-430c-bf83-532857700366	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
93ba7b70-05db-4b7a-b73a-a64208b4b000	50236454-7014-430c-bf83-532857700366	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
8352bda8-4656-4a91-8f1a-dfa42f589b06	50236454-7014-430c-bf83-532857700366	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
a6f7f4f0-26df-468f-8888-870f740d616b	50236454-7014-430c-bf83-532857700366	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
eacf267f-57a6-4e94-b405-73dcc43e9a23	50236454-7014-430c-bf83-532857700366	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
e3feb585-ab55-438b-ad1a-28b215c3e5d7	50236454-7014-430c-bf83-532857700366	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
d6c7c6fc-4d0c-4f9a-94e8-d52b849f10f0	50236454-7014-430c-bf83-532857700366	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
844d6e35-3053-4de7-96a5-3ce266f7daa4	50236454-7014-430c-bf83-532857700366	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
6c19c50d-0ed6-4476-91d6-e815bda01cdb	50236454-7014-430c-bf83-532857700366	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	65	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
6aabe8aa-62bc-41bc-a973-217a681222d2	50236454-7014-430c-bf83-532857700366	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
4eeb6ddc-fce7-4799-828b-6af071a31271	50236454-7014-430c-bf83-532857700366	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	7	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
c40c1503-e668-4c94-a47f-25eb1feef82d	50236454-7014-430c-bf83-532857700366	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
7113f1d5-ec21-4093-be48-3a4d69eeb213	50236454-7014-430c-bf83-532857700366	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
710b5708-3106-46d7-9de0-16cc59dacfe7	50236454-7014-430c-bf83-532857700366	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
a9a6ce46-b8bc-42fc-9e26-2c3b366bde9a	50236454-7014-430c-bf83-532857700366	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
0c194fe4-ede5-455e-ad90-d8e98d0b0cdc	50236454-7014-430c-bf83-532857700366	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
d2b72478-884d-430e-9187-f3955550e6a8	50236454-7014-430c-bf83-532857700366	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
b106af40-6833-4446-be9a-73bfd9275beb	50236454-7014-430c-bf83-532857700366	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
de811222-02c8-42e2-88bc-41786ccd35a6	50236454-7014-430c-bf83-532857700366	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
a195cb6b-93b4-4541-8630-86c15cf604bf	50236454-7014-430c-bf83-532857700366	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:31:37.259+00
e55e2647-0bbd-41df-b566-ab11f49ceefe	50236454-7014-430c-bf83-532857700366	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	56	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
b5d0728a-4791-43c1-bce1-833116c3957d	50236454-7014-430c-bf83-532857700366	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
5214c740-d817-43a2-a3f9-4b5be7fe7401	50236454-7014-430c-bf83-532857700366	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
ef763578-95d3-428c-a179-ada4936bcfa3	50236454-7014-430c-bf83-532857700366	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
bbe527a1-64ca-4c15-8ad0-4f8eeac5ac26	50236454-7014-430c-bf83-532857700366	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	7	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
b5bc255b-230c-4ddd-aa56-8a5bdf9fb136	50236454-7014-430c-bf83-532857700366	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
f4454ee4-6119-45aa-8a44-78382e9ee0df	50236454-7014-430c-bf83-532857700366	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
b62374b1-0a16-4d69-9f1e-fd85bd38e126	50236454-7014-430c-bf83-532857700366	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
2ad794b3-96b9-4858-a701-c78a38267733	50236454-7014-430c-bf83-532857700366	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
2c4f5676-933b-4997-a6a2-37e850ae2dd0	50236454-7014-430c-bf83-532857700366	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
1b0baee1-86a9-4828-9711-f2cba48b7e22	50236454-7014-430c-bf83-532857700366	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
244e73b0-400c-4c75-bc14-e1f6df057410	50236454-7014-430c-bf83-532857700366	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
0942de66-f012-4cd2-a8cc-6bdc1f21990e	50236454-7014-430c-bf83-532857700366	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
1bddb022-8b5c-499f-8b92-875fbd655178	50236454-7014-430c-bf83-532857700366	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
c9f6691a-dc8d-483f-a13e-235448c13ed0	50236454-7014-430c-bf83-532857700366	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
c74fd4ea-0909-4214-bd28-1c607142477c	50236454-7014-430c-bf83-532857700366	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
47213011-0eb4-43ef-8a7b-6c4a837144b5	50236454-7014-430c-bf83-532857700366	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
1981d53a-3a45-4731-9330-b409c5386e2a	50236454-7014-430c-bf83-532857700366	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	65	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
f38dcfa7-be9e-41e7-9569-448552124296	50236454-7014-430c-bf83-532857700366	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
c99ab87b-8887-4367-8b85-6d7ff0cc1dfc	50236454-7014-430c-bf83-532857700366	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	7	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
ae0d4071-5a2b-417d-a671-bed6256ad9fb	50236454-7014-430c-bf83-532857700366	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
230e5387-83b6-4edc-99df-2d41be606da6	50236454-7014-430c-bf83-532857700366	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
f863931c-604b-416c-8883-733b8fd2b76b	50236454-7014-430c-bf83-532857700366	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
928ed0bb-16db-4580-a866-2ce4ea71a87e	50236454-7014-430c-bf83-532857700366	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
4405aca2-c0ab-452e-86e0-6cd07b1d6beb	50236454-7014-430c-bf83-532857700366	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
00f8a763-c4e0-4269-8d28-fde1c332e46c	50236454-7014-430c-bf83-532857700366	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
e004595f-5209-46bb-862a-5e64e25fd401	50236454-7014-430c-bf83-532857700366	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
195e6217-865c-4eab-b82e-9fb400a35042	50236454-7014-430c-bf83-532857700366	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
abeb1d77-9582-46b7-81b5-49eb7c7a94ca	50236454-7014-430c-bf83-532857700366	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Sam´s Club Farol	REC-NK1D9	Recife	2026-04-20 11:41:35.186+00
98c299a3-f7fd-4401-bda2-e3f18e417a67	b99c0f5a-fd87-49f1-ac96-b790b51ed696	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
7475f287-d715-4b92-bccb-55327ce4c881	b99c0f5a-fd87-49f1-ac96-b790b51ed696	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
f8f00b6d-2260-4602-bff1-6d5ed42fb096	b99c0f5a-fd87-49f1-ac96-b790b51ed696	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
e2bca90a-5532-49e2-9a30-30c5ad5d97c2	b99c0f5a-fd87-49f1-ac96-b790b51ed696	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
e2c64efa-039b-406d-8e00-2d030299a926	b99c0f5a-fd87-49f1-ac96-b790b51ed696	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
cc5e298e-bdc3-483f-b5e9-40354d83299f	b99c0f5a-fd87-49f1-ac96-b790b51ed696	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	65	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
17a758ed-7e0e-43a5-ad7c-9495b2ce085d	b99c0f5a-fd87-49f1-ac96-b790b51ed696	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
0af6c9a7-a33f-4f00-b785-148284cf812b	b99c0f5a-fd87-49f1-ac96-b790b51ed696	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
8af3cea6-51c3-41b9-8abb-4c1bcd190416	b99c0f5a-fd87-49f1-ac96-b790b51ed696	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
e7e36121-ce5f-4cf2-a74e-894a28ee64a2	b99c0f5a-fd87-49f1-ac96-b790b51ed696	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
df652d7c-19c2-4791-8c25-b21d22466555	b99c0f5a-fd87-49f1-ac96-b790b51ed696	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
dd5983f4-d775-4ffb-915d-f5d8a3d7c742	b99c0f5a-fd87-49f1-ac96-b790b51ed696	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
958a69da-b188-427f-a9f6-c6a4107270ca	b99c0f5a-fd87-49f1-ac96-b790b51ed696	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
e966d69e-2084-450e-ae46-40edd842daa4	b99c0f5a-fd87-49f1-ac96-b790b51ed696	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
2b8e2761-6527-484f-82c1-0f1e95ee6dd0	b99c0f5a-fd87-49f1-ac96-b790b51ed696	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
c28ada28-e7ae-4233-89dd-93548f4c361f	b99c0f5a-fd87-49f1-ac96-b790b51ed696	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
386799ee-293f-4fbc-b255-f39062f10e75	b99c0f5a-fd87-49f1-ac96-b790b51ed696	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
09831b0f-60ae-4b79-a284-e757ef382f11	b99c0f5a-fd87-49f1-ac96-b790b51ed696	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
872f6294-96ad-4030-bfc4-7a55fefefe25	b99c0f5a-fd87-49f1-ac96-b790b51ed696	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
03aabf76-e4f4-4b33-9688-ffa9468680f2	b99c0f5a-fd87-49f1-ac96-b790b51ed696	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
3513a6a1-eeba-4fad-bfc5-ff0b58136b22	b99c0f5a-fd87-49f1-ac96-b790b51ed696	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	65	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
914f67e6-8abe-49d5-9b04-0461f3200c24	b99c0f5a-fd87-49f1-ac96-b790b51ed696	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
9ed8b08e-0f03-40dc-b0f8-e49d1ed74266	b99c0f5a-fd87-49f1-ac96-b790b51ed696	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
f5ec7921-1add-422d-873d-2b7290e57209	b99c0f5a-fd87-49f1-ac96-b790b51ed696	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
a71fec81-8d11-4fbf-8819-266553852cd3	b99c0f5a-fd87-49f1-ac96-b790b51ed696	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	32	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
210a21ac-8330-483f-8981-83fe9e9bc7f5	b99c0f5a-fd87-49f1-ac96-b790b51ed696	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
155a3bfb-cbf9-4839-ae3f-5a9444a0c0bb	b99c0f5a-fd87-49f1-ac96-b790b51ed696	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	56	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
5376237b-6ca2-4029-9c33-f4b9fff4aa28	b99c0f5a-fd87-49f1-ac96-b790b51ed696	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
23285805-0b0b-4ef6-a16d-2f0f4455c2d4	b99c0f5a-fd87-49f1-ac96-b790b51ed696	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
60c111c8-ea0d-441f-91bd-78aa4d1da496	b99c0f5a-fd87-49f1-ac96-b790b51ed696	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OQ7UO	Recife	2026-04-20 12:01:16.589+00
0987dac4-7ffe-4293-b41b-e7d8fff76773	2286bd50-38eb-4e83-be0c-c2187f127f9a	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
ee634af5-b1f8-4a74-9e65-747ae748fda9	2286bd50-38eb-4e83-be0c-c2187f127f9a	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
d599eb42-96ad-40cc-b967-fe4b0c05ee3e	2286bd50-38eb-4e83-be0c-c2187f127f9a	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
3a3c0890-1698-4aca-931e-2db656766cd1	2286bd50-38eb-4e83-be0c-c2187f127f9a	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
6b410363-fd9a-4573-befb-2970f96296fb	2286bd50-38eb-4e83-be0c-c2187f127f9a	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
40613cfd-7218-498e-a061-75c65a1caff2	2286bd50-38eb-4e83-be0c-c2187f127f9a	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	32	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
9f889672-68bc-4dfd-8bba-a14c9314c7f7	2286bd50-38eb-4e83-be0c-c2187f127f9a	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
0d181d27-8a14-4efd-b791-4d124cecaacf	2286bd50-38eb-4e83-be0c-c2187f127f9a	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
c86dba0f-ae9f-4d7b-b998-ae82d9779dc0	2286bd50-38eb-4e83-be0c-c2187f127f9a	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
5845107d-2f9c-479c-b22d-a4d88e1efba6	2286bd50-38eb-4e83-be0c-c2187f127f9a	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
3397a4ef-7f82-4926-92fa-ac9902303631	2286bd50-38eb-4e83-be0c-c2187f127f9a	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
3327557d-4694-4d44-be9a-5d081c8e6fb5	2286bd50-38eb-4e83-be0c-c2187f127f9a	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
ffa76cdc-5949-40a9-92bd-1e20b31b0c61	2286bd50-38eb-4e83-be0c-c2187f127f9a	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
f24ba305-72c3-4020-a033-1847285c7ef0	2286bd50-38eb-4e83-be0c-c2187f127f9a	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
bba55c07-6bdb-45ed-aaba-9ec8f6df5395	2286bd50-38eb-4e83-be0c-c2187f127f9a	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	7	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
44520b05-93e5-404c-ab96-fee5b366622a	2286bd50-38eb-4e83-be0c-c2187f127f9a	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
7fb3828b-a151-4a6c-bea1-f1fb78a10b4d	2286bd50-38eb-4e83-be0c-c2187f127f9a	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
caee4aa2-6854-40f3-92ba-c8165701db05	2286bd50-38eb-4e83-be0c-c2187f127f9a	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
57f2527e-c91c-45f4-b6af-f61f9f414bd1	2286bd50-38eb-4e83-be0c-c2187f127f9a	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
ca459f3d-08e4-4d21-ab22-9e1899cef6e3	2286bd50-38eb-4e83-be0c-c2187f127f9a	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
51eab29a-54fe-4137-b047-080a32153410	2286bd50-38eb-4e83-be0c-c2187f127f9a	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	32	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
8d27e4ad-f679-4b19-8a29-f9715bbe977d	2286bd50-38eb-4e83-be0c-c2187f127f9a	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
2c049c79-2c30-4d13-a1a6-21163304c423	2286bd50-38eb-4e83-be0c-c2187f127f9a	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	11	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
d4fd9986-a713-4eb9-adb8-eba9cbccecf6	2286bd50-38eb-4e83-be0c-c2187f127f9a	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
f52cc894-4007-4979-b796-9f9b05aa2817	2286bd50-38eb-4e83-be0c-c2187f127f9a	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
924a261e-7202-4a35-ae05-4220c440ea23	2286bd50-38eb-4e83-be0c-c2187f127f9a	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	33	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
2b385987-8912-45ab-90a1-49968b829b50	2286bd50-38eb-4e83-be0c-c2187f127f9a	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
c3ebd57f-ce15-4cbf-bff7-b9f0ce26f563	2286bd50-38eb-4e83-be0c-c2187f127f9a	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
fe9dd081-38dc-4a77-bb84-71e241d8ad53	2286bd50-38eb-4e83-be0c-c2187f127f9a	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
e420ea28-9c06-427b-b3ac-885ee70473c1	2286bd50-38eb-4e83-be0c-c2187f127f9a	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
47866cf4-d5ee-4ff0-a9ba-e14b3173ec5b	2286bd50-38eb-4e83-be0c-c2187f127f9a	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:32.479+00
ae3a3d71-bac0-45f6-b226-73dc7e9f79b4	2286bd50-38eb-4e83-be0c-c2187f127f9a	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
e6e21e7b-df4b-4ede-86cc-fb95bd1fb7e3	2286bd50-38eb-4e83-be0c-c2187f127f9a	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
699415cf-664f-477d-a02c-f9a74359005b	2286bd50-38eb-4e83-be0c-c2187f127f9a	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
ab79af72-26a9-4621-85e7-7db113a08174	2286bd50-38eb-4e83-be0c-c2187f127f9a	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
cbf796bc-3e0d-4fdf-8080-46f5e4256eef	2286bd50-38eb-4e83-be0c-c2187f127f9a	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
bb485e59-63fb-46f3-a0be-69f44df65a68	2286bd50-38eb-4e83-be0c-c2187f127f9a	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	32	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
6ce80473-d70d-4aa3-b70f-ddcedbde4f23	2286bd50-38eb-4e83-be0c-c2187f127f9a	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
91e01e2e-8cbd-4fb1-9fe5-e964c060fe9c	2286bd50-38eb-4e83-be0c-c2187f127f9a	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
df72a842-c920-4d04-a155-2a6c9480c01c	2286bd50-38eb-4e83-be0c-c2187f127f9a	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
c393e867-83f6-44cd-9cc0-8679c95c5f85	2286bd50-38eb-4e83-be0c-c2187f127f9a	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
fd81ea8b-5100-49c4-bfc1-8a8b7fa0d346	2286bd50-38eb-4e83-be0c-c2187f127f9a	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
78f60b95-e8cb-4613-9150-521456a51984	2286bd50-38eb-4e83-be0c-c2187f127f9a	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
d6b12122-4d02-4d7f-8f16-4ca8c42e8fa5	2286bd50-38eb-4e83-be0c-c2187f127f9a	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	5	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
347296f9-08fa-4976-ac05-245ea7e3c13e	2286bd50-38eb-4e83-be0c-c2187f127f9a	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	4	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
11d6a12e-f21b-4030-9a19-8176a78db1af	2286bd50-38eb-4e83-be0c-c2187f127f9a	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	7	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
b1eaaaf6-041b-4750-b171-ffba49235ce3	2286bd50-38eb-4e83-be0c-c2187f127f9a	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
e280881d-c3fc-4bb2-877f-c2c3cbe6a967	2286bd50-38eb-4e83-be0c-c2187f127f9a	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
f155dbe6-5369-46a6-8c34-018add5178c1	2286bd50-38eb-4e83-be0c-c2187f127f9a	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
e59f2f16-7755-414f-afec-8ebfdab9d6ac	2286bd50-38eb-4e83-be0c-c2187f127f9a	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
4802d057-f980-4893-9506-c5f9a51ef59f	2286bd50-38eb-4e83-be0c-c2187f127f9a	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
2fd9bc8e-099e-4e83-8098-3c56b57096f2	2286bd50-38eb-4e83-be0c-c2187f127f9a	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	32	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
a9ae8937-31b7-4b3a-a510-a63056028acf	2286bd50-38eb-4e83-be0c-c2187f127f9a	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	1	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
37b05405-6f96-443b-b3e9-8271fa8b98a8	2286bd50-38eb-4e83-be0c-c2187f127f9a	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	11	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
fbf13a56-2480-4d72-8898-fe00640387c8	2286bd50-38eb-4e83-be0c-c2187f127f9a	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
e05de1b9-30ba-4067-afb5-304c9468ec53	2286bd50-38eb-4e83-be0c-c2187f127f9a	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	2	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
652d7977-a463-4fe1-8315-d0231c0b3864	2286bd50-38eb-4e83-be0c-c2187f127f9a	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	33	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
280d50ab-4fdb-4430-b770-1d3facc54789	2286bd50-38eb-4e83-be0c-c2187f127f9a	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	3	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
a288f2ec-2407-428d-9351-cc291c129a8d	2286bd50-38eb-4e83-be0c-c2187f127f9a	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	8	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
c48a13bc-f185-4ea5-ae25-588b9c1e9ade	2286bd50-38eb-4e83-be0c-c2187f127f9a	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
cd17f2c2-b999-4da4-abc7-120ba9f32b66	2286bd50-38eb-4e83-be0c-c2187f127f9a	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	9	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
c0821d04-5c68-4ef5-a877-8e2827f5d8fc	2286bd50-38eb-4e83-be0c-c2187f127f9a	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	6	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	Paulista	REC-OUTXB	Recife	2026-04-20 13:39:40.262+00
3f42ae4c-44cd-4e7a-9aaf-b05986a6bac0	60631049-54e3-4f6b-a129-b26abd0a9e2d	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	5	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
47e8425e-29f8-4095-85d2-ccef904b932c	60631049-54e3-4f6b-a129-b26abd0a9e2d	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
cb950f8b-bdc6-4de1-b006-9940791674c8	60631049-54e3-4f6b-a129-b26abd0a9e2d	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
1745ef6e-6357-4bd5-8475-b4c27ac7307f	60631049-54e3-4f6b-a129-b26abd0a9e2d	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
97a210e8-7665-42c4-bd55-43a2e3db0e3a	60631049-54e3-4f6b-a129-b26abd0a9e2d	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	5	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
95d09aef-597e-43e4-8b6e-e71f37ad5e24	60631049-54e3-4f6b-a129-b26abd0a9e2d	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
b333933c-e58d-4c48-ace0-90ee6a7a3be8	60631049-54e3-4f6b-a129-b26abd0a9e2d	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
41b6af63-fb55-41af-af14-6924955f7c16	60631049-54e3-4f6b-a129-b26abd0a9e2d	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	1	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
2adafee7-2aad-46db-9771-be4a83159b22	60631049-54e3-4f6b-a129-b26abd0a9e2d	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
15dbdc37-9ff2-4d3e-88c8-39ef6c1c59b7	60631049-54e3-4f6b-a129-b26abd0a9e2d	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
0c45480c-6816-4642-9ef9-e69d5d3c4356	60631049-54e3-4f6b-a129-b26abd0a9e2d	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	4	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
63427e64-5738-4570-8974-6781a9bf9e04	60631049-54e3-4f6b-a129-b26abd0a9e2d	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	7	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
2d509d3c-a914-4ca5-b28b-23a0ffecca1e	60631049-54e3-4f6b-a129-b26abd0a9e2d	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	8	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
94f0a401-813d-4ccc-b952-8ab5a81cf1c6	60631049-54e3-4f6b-a129-b26abd0a9e2d	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	9	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
e0a53125-f478-4b76-9985-466a2c24f239	60631049-54e3-4f6b-a129-b26abd0a9e2d	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
e9f58218-797f-474a-8e98-b03ca422ada6	60631049-54e3-4f6b-a129-b26abd0a9e2d	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
9c3cfb30-39a7-474b-bdc5-f26f974aaf2d	60631049-54e3-4f6b-a129-b26abd0a9e2d	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	23	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
e49ffa79-1f56-4b52-9fa6-1f6c66a44802	60631049-54e3-4f6b-a129-b26abd0a9e2d	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
1f07846b-4486-4e77-8da2-7cbc44e21c48	60631049-54e3-4f6b-a129-b26abd0a9e2d	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	23	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
f966591b-bb6c-415b-82e1-e1806ee9e810	60631049-54e3-4f6b-a129-b26abd0a9e2d	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
4987059d-1d50-4c19-9434-d504efb10170	60631049-54e3-4f6b-a129-b26abd0a9e2d	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
0f35b6e2-4f62-43c6-8d6a-fbb663c782ab	60631049-54e3-4f6b-a129-b26abd0a9e2d	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
14fbf49c-9b11-4da8-b79c-1defe0f8dda9	60631049-54e3-4f6b-a129-b26abd0a9e2d	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
a2f29c56-57d1-48d7-a281-1992c58c4d3e	60631049-54e3-4f6b-a129-b26abd0a9e2d	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
796130fa-6f36-449e-8e00-ebdd1dc10a36	60631049-54e3-4f6b-a129-b26abd0a9e2d	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	2	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
e4de486f-0c37-477e-b6b5-6a0401897ecd	60631049-54e3-4f6b-a129-b26abd0a9e2d	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	3	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
1c8751e8-ab9f-4883-a769-505a6abf1703	60631049-54e3-4f6b-a129-b26abd0a9e2d	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	36	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
b49ab12b-59e3-4f48-aed5-ba1e776a0bd2	60631049-54e3-4f6b-a129-b26abd0a9e2d	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
7fe3f832-62d8-4c4e-a6bd-6849626ab259	60631049-54e3-4f6b-a129-b26abd0a9e2d	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	6	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Shopping Pátio	REC-QMVEQ	Recife	2026-04-20 21:24:21.835+00
65403f99-da43-4ad7-921a-7c32bb15811c	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	9	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
418ec9fa-4921-4114-8430-712bfddf080d	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	60	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
2302d2b9-85a2-4a8a-afbc-69390e12adbb	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	30	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
29b25e5e-49d6-4dca-aee4-1caba7431d1e	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	3	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
405e61c9-62f2-4937-a778-f5a72e77b20b	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	Empada Salgada	6	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
05be13ae-fd08-401f-9e4a-ba191d9cb7c8	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	3	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
8f9fc5ea-b2a4-462b-a88d-4c9a5e93c183	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	3	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
468a430d-1041-4424-a69d-7e6f835dee05	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	5	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
4d7d66fb-eae3-4473-9c8c-ba3e2ff95a6a	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	1	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
aea6e691-0d68-430c-b346-f5fcbb6a41ae	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	9	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
6e09576d-2ec6-47f6-9503-3c00fece87a7	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	5	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
8c294ced-8360-4ef2-9504-328445fdfadd	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	7	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
4fef5645-18d3-4e3c-8553-18c96f354799	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	5	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
88505adc-143e-40d7-82d4-8777bcd527a4	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	1	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
838a7af5-e588-4334-925b-52b9083801ad	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	8	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
eb205f5d-6e3f-4f45-b684-dacd28d95bc1	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	3	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
bcd1ee18-a4bf-4735-9466-7698ed6c464f	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	2	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
8b9517a6-a8c7-42b4-b4ff-58b379690d0c	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	3	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
8ac2cadb-b816-4f5b-a6c0-f3ca4c34c4a9	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	9	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
2b7c2615-45b0-49a6-a01b-42ef28aaa6c6	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	1	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
105d48a8-5242-4fa6-9fe3-fb2c7009eda9	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	2	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
5bff957f-5870-4609-b8dd-e41e3dfe9cd6	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	8	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
e7694f37-32c5-4a7f-85cc-49ebb8db6f58	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	23	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
65eecfd1-f72f-46da-ac5f-7a09b3567147	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	9	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
607b284f-ec7d-40f4-91bf-4e3b26ed2ae3	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	1	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
f104190c-dfc7-4539-bbdd-48ed76d169f7	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	Fardamento	8	\N		Paulista	REC-PCSEZ	Recife	2026-04-20 23:55:25.008+00
0e377db2-8333-4cb2-b1f5-2859c4d23a80	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	Empada Salgada	6	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
e741935e-bed8-4390-b545-8ffec004ee9b	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	Empada Salgada	6	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
e4da5a84-f814-4bd0-89e6-51be89d66693	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	Empada Salgada	9	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
06840747-e9ed-466c-83e0-550b4316b091	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	Empada Salgada	30	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
af19acdf-f11d-4d84-b71d-34fd821ed8d7	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	Empada Salgada	10	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
91bc2574-6a3a-4cda-bc99-e2ad5d22bc50	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	Empada Salgada	8	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
a14f73ea-b718-473a-bc8c-a0bc145b10dc	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	Empada Salgada	9	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
b34e9f06-e6f1-43de-8e28-9faf008d4dde	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	Empada Salgada	3	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
37341fc1-5b51-4f97-8027-ba270b0c7fee	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	Empada Salgada	2	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
91ad29b7-22ff-4593-be46-6b555d9f5737	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	Empada Salgada	10	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
4584ece4-e7a5-4fd3-be81-5777d54893e8	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	Empada Salgada	2	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
bcd32f5f-60f5-45ac-a1b9-4670c5273cc6	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	Empada Salgada	5	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
c1b425c2-6e61-42ce-ac3a-b6a873b11c2b	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	Empada Salgada	7	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
332c6b7e-fcfc-4e62-b9b6-79427105054b	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	Empadas Doces	5	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
9dbcd6dd-1655-4ff8-b565-d59f1751b041	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	Empadas Doces	6	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
619efa5a-8a55-4931-8adb-daae01e5d46f	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	Empadas Doces	30	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
ad679857-6948-4764-a5f4-bb5c3797cc33	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	Empadas Doces	1	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
28007ce2-09b2-415a-83a1-39c98439c428	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	Empadas Doces	5	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
331468ce-d2b4-4a82-a447-94bf48870b02	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	Pastéis	80	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
e6279878-cacc-41d1-99dd-b1a4b207b6e4	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	Pastéis	10	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
6cfac059-f2e0-4304-b709-16caa5e782cf	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	Pastéis	2	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
f956fdec-9b77-43ae-ad44-592d39858767	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	Pastéis	90	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
7f6aab1b-11a7-47f5-90c1-e7fe3fa673c4	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	Descartáveis	2	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
db9d48c6-3087-435a-99b1-7969d5de6fb2	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	Descartáveis	40	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
161bfbf5-982d-4a8a-9567-5298e899683a	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	Descartáveis	8	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
0a977105-61ca-4e2a-8237-1b1bca7c4cbd	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	Descartáveis	30	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
3a689439-57e8-46d7-95ff-f813c30a40f9	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	Descartáveis	20	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
1436d5d4-4f4c-4557-ab72-5684f433bd9d	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	Fardamento	1	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
b2399bb2-bd90-46ff-ab3b-ba26d9699435	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	8aeb7806-f733-499e-b2b0-74856b551258	Touca	Fardamento	80	\N		Shopping Pátio	REC-QBAZ4	Recife	2026-04-21 00:15:20.879+00
\.


--
-- Data for Name: dismissed_orders; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.dismissed_orders (id, order_id, driver_id, region, dismissed_at) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.usuarios (id, nome, email, telefone, cargo, criado_em, nome_usuario) FROM stdin;
\.


--
-- Data for Name: entregas; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.entregas (id, motorista_id, frota_id, destino, status, criado_em) FROM stdin;
\.


--
-- Data for Name: franchisees; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.franchisees (id, name, phone, email, region, initials, uf, city, state, points, created_at) FROM stdin;
5ecc2433-addf-40e4-8ee9-e489213d421c	Gustavo Mesquita	8199245000	\N	Recife	GM	AL	Maceió	Alagoas	[{"id": "3ce5aa33-f5ed-47a5-aa5c-5ec19f5b5b07", "uf": "AL", "city": "Maceió", "name": "Shopping Pátio"}, {"id": "a3fcb5f7-39f9-45ff-be26-344b9fe08161", "uf": "AL", "city": "Maceió", "name": "Sam´s Club Farol"}, {"id": "6421eec3-b056-4169-98a9-c30a36e1c523", "uf": "AL", "city": "Maceió", "name": "Parque Shopping Maceió"}, {"id": "501e3bb9-8fa9-4b08-b02e-2ced362094b7", "uf": "PE", "city": "Recife", "name": "Paulista", "isNew": true}, {"id": "7117f71d-12b4-480e-9130-f7490c0dceff", "uf": "PE", "city": "Recife", "name": "ETC", "isNew": true}]	2026-04-17 22:09:24.442507+00
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.vehicles (id, brand, model, year, plate, color, photo_url, current_km, next_oil_change_km, oil_change_interval, next_revision_km, revision_interval, region, status, created_at, assigned_driver_id, driver_name, fuel_level, fuel_status) FROM stdin;
c3fc630c-17c5-41b3-90aa-3c455ff71123	Fiat	Strada	2021	PLN1I63	Branco	http://72.60.61.216:8000/storage/v1/object/public/vehicle-photos/1776193053375_PLN1I63.PNG	1234567892	223456	10000	138456	20000	Recife	Em Uso	2026-04-14 19:01:14.989911+00	d3720269-de76-4244-ac07-9a0cc3b81da6	Ismael Rodrigues	75	3/4
f043f0f1-93f3-45e7-8687-1a8c61fa3429	KIA	Bongo	2023	RPG1G71	Branca	http://72.60.61.216:8000/storage/v1/object/public/vehicle-photos/1776291625367_bongo.jpeg	2345689	214466	10000	219466	20000	Recife	Em Uso	2026-04-15 22:21:10.79713+00	\N	Tulio Motorista	75	3/4
9579ac02-2a7a-4fa1-b6e0-5598f136f2dd	Fiat	Strada	2021	IZZ3I65	Branca	http://72.60.61.216:8000/storage/v1/object/public/vehicle-photos/1776337451796_IZZ.jpeg	125698	222028	10000	227028	20000	Recife	Em Uso	2026-04-16 11:05:00.639134+00	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	100	Cheio
\.


--
-- Data for Name: fuel_registrations; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.fuel_registrations (id, vehicle_id, vehicle_name, vehicle_plate, driver_id, fuel_level, fuel_status, km, total_value, price_per_liter, volume, receipt_url, region, created_at) FROM stdin;
81bb3e80-9b0b-4427-be1c-1d6462a641cb	9579ac02-2a7a-4fa1-b6e0-5598f136f2dd	Fiat Strada	IZZ3I65	\N	100	Cheio	125698	235	6.21	52	http://72.60.61.216:8000/storage/v1/object/public/delivery-photos/fuel_9579ac02-2a7a-4fa1-b6e0-5598f136f2dd_1776562703633.jpg	Recife	2026-04-19 01:38:24.791349+00
5857a1c9-a4c5-4c8d-b709-7f2ed081faaa	f043f0f1-93f3-45e7-8687-1a8c61fa3429	KIA Bongo	RPG1G71	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	75	3/4	2345689	321	5.24	60	http://72.60.61.216:8000/storage/v1/object/public/delivery-photos/fuel_f043f0f1-93f3-45e7-8687-1a8c61fa3429_1776621307037.jpg	Recife	2026-04-19 17:55:07.389095+00
eb708756-6acd-41dd-a897-13a6685355da	c3fc630c-17c5-41b3-90aa-3c455ff71123	Fiat Strada	PLN1I63	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	8	Reserva	1234567	\N	\N	\N	\N	Recife	2026-04-19 19:05:12.947143+00
56de1bac-632b-4d68-99cc-d54bbd3d6302	c3fc630c-17c5-41b3-90aa-3c455ff71123	Fiat Strada	PLN1I63	398ef1e1-3188-4897-a203-dc4f0e4bedda	100	Cheio	1234568	321	3.21	60	\N	Recife	2026-04-20 12:55:29.174338+00
3b1c9142-a7c6-420d-9ef4-671628bf4a8d	c3fc630c-17c5-41b3-90aa-3c455ff71123	Fiat Strada	PLN1I63	398ef1e1-3188-4897-a203-dc4f0e4bedda	8	Reserva	1234568	321	3.21	60	http://72.60.61.216:8000/storage/v1/object/public/delivery-photos/fuel_c3fc630c-17c5-41b3-90aa-3c455ff71123_1776689893466.jpg	Recife	2026-04-20 12:58:13.992553+00
5b2cb31c-adee-4421-b5f7-4f6713903079	c3fc630c-17c5-41b3-90aa-3c455ff71123	Fiat Strada	PLN1I63	\N	100	Cheio	123456789	321	3.21	59	http://72.60.61.216:8000/storage/v1/object/public/delivery-photos/fuel_c3fc630c-17c5-41b3-90aa-3c455ff71123_1776691569820.jpg	Recife	2026-04-20 13:26:10.32616+00
\.


--
-- Data for Name: notificacoes; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.notificacoes (id, titulo, mensagem, lida, criado_em) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.notifications (id, title, message, type, severity, read, user_id, link, created_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.order_items (id, order_id, product_id, product_name, quantity, cost_price, sale_price, region, created_at, category) FROM stdin;
6b9be925-1068-4d53-95e1-99c012ce29ce	50236454-7014-430c-bf83-532857700366	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	4	3.5	66.5	Recife	2026-04-18 18:10:17.559498+00	Empada Salgada
e364543f-d74e-4090-8a61-e99d6bce6701	50236454-7014-430c-bf83-532857700366	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	6	3.5	66.5	Recife	2026-04-18 18:10:17.559498+00	Empada Salgada
edbd7c7b-aaf5-4660-b124-6415f5057c99	2286bd50-38eb-4e83-be0c-c2187f127f9a	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	4	3.5	66.5	Recife	2026-04-18 18:46:40.874259+00	Empada Salgada
5a776f9d-8474-4a78-80eb-54b935e2a1e6	2286bd50-38eb-4e83-be0c-c2187f127f9a	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	16	3.5	66.5	Recife	2026-04-18 18:46:40.874259+00	Empada Salgada
9f9b34fe-5ea3-486f-94ba-be1f93372ea3	2286bd50-38eb-4e83-be0c-c2187f127f9a	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	8	3.5	66.5	Recife	2026-04-18 18:46:40.874259+00	Empada Salgada
8d7a64f7-b8cd-480d-9900-b1b78c121f4a	f9e20155-b792-41b9-9a8c-fbdf577619d4	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	7	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
34a6cf9c-0508-4c39-a427-fc38784584fd	f9e20155-b792-41b9-9a8c-fbdf577619d4	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	9	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
4adc4d09-f96b-431c-8690-03f6e9571437	f9e20155-b792-41b9-9a8c-fbdf577619d4	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	15	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
c5240c91-0e3e-4a7d-87cc-b7cc898f07b4	f9e20155-b792-41b9-9a8c-fbdf577619d4	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	12	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
2a025735-76ad-4115-8323-3e8b73403739	f9e20155-b792-41b9-9a8c-fbdf577619d4	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	14	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
5a0cdaad-69f7-4f4b-8e00-09b058464cb3	f9e20155-b792-41b9-9a8c-fbdf577619d4	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	16	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
a6a42307-d00e-43b1-959f-2f6ed343579a	f9e20155-b792-41b9-9a8c-fbdf577619d4	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	16	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
c8b47088-4ac3-4404-a73c-309c355f6320	f9e20155-b792-41b9-9a8c-fbdf577619d4	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	14	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
0ce3633d-64b3-468e-8da8-aa7b86a38686	f9e20155-b792-41b9-9a8c-fbdf577619d4	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	13	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
baa2fe11-6384-4da9-bf0a-6a29406cde2f	f9e20155-b792-41b9-9a8c-fbdf577619d4	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	16	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
0264b932-66e6-44bf-9748-ba52555cd2c0	f9e20155-b792-41b9-9a8c-fbdf577619d4	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	15	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
5c8bc20c-5588-4763-93cf-0dfcd87215d2	f9e20155-b792-41b9-9a8c-fbdf577619d4	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	16	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
6cd15804-d9fb-4394-ab6f-4948e8396cc6	f9e20155-b792-41b9-9a8c-fbdf577619d4	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	16	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
e78177da-e0f6-48cf-83b1-9b01277502cd	f9e20155-b792-41b9-9a8c-fbdf577619d4	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	16	3.5	66.5	Recife	2026-04-18 19:15:55.042381+00	Empada Salgada
1ce03a2c-0513-4d6d-b4b4-821230c47776	f9e20155-b792-41b9-9a8c-fbdf577619d4	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	14	3.5	63	Recife	2026-04-18 19:15:55.042381+00	Empadas Doces
28bd3eb2-33ce-4101-bade-c5298a7a08ff	f9e20155-b792-41b9-9a8c-fbdf577619d4	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	12	3.5	63	Recife	2026-04-18 19:15:55.042381+00	Empadas Doces
ebcda432-8075-452d-986b-805c8989232a	f9e20155-b792-41b9-9a8c-fbdf577619d4	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	16	3.5	63	Recife	2026-04-18 19:15:55.042381+00	Empadas Doces
43f70aaf-570e-4f87-9721-f7fd06ea8d16	f9e20155-b792-41b9-9a8c-fbdf577619d4	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	13	3.5	63	Recife	2026-04-18 19:15:55.042381+00	Empadas Doces
7a869886-8c8e-42c0-b02c-426d34d34608	f9e20155-b792-41b9-9a8c-fbdf577619d4	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	14	2.4	63	Recife	2026-04-18 19:15:55.042381+00	Empadas Doces
511d61cd-7bf2-4e32-84d0-21d2405ca1ca	f9e20155-b792-41b9-9a8c-fbdf577619d4	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	14	4.42	53.04	Recife	2026-04-18 19:15:55.042381+00	Pastéis
2e26ea80-6228-465f-93ef-61823e9ae580	f9e20155-b792-41b9-9a8c-fbdf577619d4	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	14	5.3	63.6	Recife	2026-04-18 19:15:55.042381+00	Pastéis
d60c75f3-e6eb-4303-a8f1-472cbaddb4d1	f9e20155-b792-41b9-9a8c-fbdf577619d4	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	15	4.42	53.04	Recife	2026-04-18 19:15:55.042381+00	Pastéis
90ac1be5-1b20-4471-af46-d2d67ca18906	f9e20155-b792-41b9-9a8c-fbdf577619d4	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	15	4.42	53.04	Recife	2026-04-18 19:15:55.042381+00	Pastéis
d9bb5bfa-9e5c-44a0-9a7f-b955ea562b99	f9e20155-b792-41b9-9a8c-fbdf577619d4	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	1	26	26	Recife	2026-04-18 19:15:55.042381+00	Descartáveis
6b1223cd-15cf-4b58-a456-4d70d30096cc	f9e20155-b792-41b9-9a8c-fbdf577619d4	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	9	130	130	Recife	2026-04-18 19:15:55.042381+00	Descartáveis
90ce8d23-13eb-4019-a2b4-05cf8a1729fe	f9e20155-b792-41b9-9a8c-fbdf577619d4	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	10	3	3	Recife	2026-04-18 19:15:55.042381+00	Descartáveis
22c66557-53a7-49a4-9250-248ee03f30d6	f9e20155-b792-41b9-9a8c-fbdf577619d4	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	10	94	94	Recife	2026-04-18 19:15:55.042381+00	Descartáveis
325428b2-c91a-4303-9c6c-4ef7ca8ac415	f9e20155-b792-41b9-9a8c-fbdf577619d4	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	10	47	47	Recife	2026-04-18 19:15:55.042381+00	Descartáveis
2b3db0b1-23ff-4955-b5a6-074246de893a	f9e20155-b792-41b9-9a8c-fbdf577619d4	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	10	40	40	Recife	2026-04-18 19:15:55.042381+00	Fardamento
84ef1a32-aee2-42b8-86b0-7e6910e493fd	f9e20155-b792-41b9-9a8c-fbdf577619d4	8aeb7806-f733-499e-b2b0-74856b551258	Touca	10	35	35	Recife	2026-04-18 19:15:55.042381+00	Fardamento
1827df60-e880-4373-a7ff-4bf10e0f338a	f9e20155-b792-41b9-9a8c-fbdf577619d4	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	16	60	60	Recife	2026-04-18 19:15:55.042381+00	Fardamento
59d6acad-320e-4898-9ffe-943dd0d558ca	176ef928-7a69-410c-969d-5c635a3f78d6	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	4	3.5	66.5	Recife	2026-04-18 19:41:54.201162+00	Empada Salgada
1e7ca34d-9e9a-46fa-b10e-ca603684d2fe	36393c51-9bc7-41bf-b1d3-9df3846304b1	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	11	3.5	66.5	Recife	2026-04-18 18:31:52.510143+00	Empada Salgada
f60df537-de1a-473a-a25e-1d795efd6a3d	36393c51-9bc7-41bf-b1d3-9df3846304b1	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	15	3.5	66.5	Recife	2026-04-18 18:31:52.510143+00	Empada Salgada
19f00a3e-753f-44f2-a3c1-5c5bafcfe645	25273826-dcfd-4f98-93d5-07ab29e6a9f5	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	7	3.5	66.5	Recife	2026-04-18 18:51:13.366989+00	Empada Salgada
296e6445-e1e8-463a-84f1-8b0d6eb01bb9	25273826-dcfd-4f98-93d5-07ab29e6a9f5	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	8	3.5	66.5	Recife	2026-04-18 18:51:13.366989+00	Empada Salgada
30aaa7b5-f174-4f1a-b96a-cb3d49eed9a0	25273826-dcfd-4f98-93d5-07ab29e6a9f5	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	16	3.5	66.5	Recife	2026-04-18 18:51:13.366989+00	Empada Salgada
4b09a9a3-3e47-457a-b07e-50780cfedd78	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	5	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
c6493d8f-ed70-4baf-b7af-3ee5b6ace8f5	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	2	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
6535968e-7e5a-47e1-b86e-1a41a5a4e7c3	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	1	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
6bbff13a-c8c2-4b9a-99d9-1e615ac1d947	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	16	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
c5bc5433-7fe1-4527-a62d-4d48acc9937a	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	15	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
77774350-3b71-427b-887f-5cad4153eb0a	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	14	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
116e6ed1-8f5c-4892-b7bd-ad90e29c31f3	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	10	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
f9e329a4-198b-45cb-81b6-f4e3d6476a3f	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	4	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
16d13fd9-a8a0-40a1-ab12-8f20557bfcda	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	7	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
e1c91214-405c-4702-9609-826fa8bff2c9	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	16	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
72ef894c-40f6-457f-8ead-4907b038a0c7	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	15	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
9be5fa7e-3930-4dec-9c75-383c0341d4f5	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	15	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
f2263719-0e0c-402d-a924-669f94d3984c	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	12	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
849957ce-c0de-4e3d-ba41-7f35027780b7	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	13	3.5	66.5	Recife	2026-04-18 19:27:29.53097+00	Empada Salgada
5a34032a-bba5-41dd-997e-c5cdd2d28ec1	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	13	3.5	63	Recife	2026-04-18 19:27:29.53097+00	Empadas Doces
a62c75e3-c225-437e-9fd2-da619e684c07	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	13	3.5	63	Recife	2026-04-18 19:27:29.53097+00	Empadas Doces
9cd8cb57-41f0-4ab4-b98b-31050db66a96	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	15	3.5	63	Recife	2026-04-18 19:27:29.53097+00	Empadas Doces
693bfa8b-313e-4937-a47a-004de608795b	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	13	3.5	63	Recife	2026-04-18 19:27:29.53097+00	Empadas Doces
d9f38b7d-7f7b-4942-bad5-b31c28672e94	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	12	2.4	63	Recife	2026-04-18 19:27:29.53097+00	Empadas Doces
ca32e46d-ccf6-44e7-bba7-0978d35fcf7f	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	17	4.42	53.04	Recife	2026-04-18 19:27:29.53097+00	Pastéis
db602fba-d1ba-454b-92c1-671427c748a5	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	13	5.3	63.6	Recife	2026-04-18 19:27:29.53097+00	Pastéis
0e120403-453f-413a-9263-3d8ee4e3953c	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	13	4.42	53.04	Recife	2026-04-18 19:27:29.53097+00	Pastéis
22910721-49f9-47db-8006-ea932ff10f27	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	11	4.42	53.04	Recife	2026-04-18 19:27:29.53097+00	Pastéis
3888b173-4411-4b9f-9245-13663101ac94	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	14	26	26	Recife	2026-04-18 19:27:29.53097+00	Descartáveis
2e704462-e43d-41bb-8541-e92ffbd0c279	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	13	130	130	Recife	2026-04-18 19:27:29.53097+00	Descartáveis
1bc1f687-6d7d-4b4c-9bfb-06c14126ac53	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	11	3	3	Recife	2026-04-18 19:27:29.53097+00	Descartáveis
29e34549-b079-4de2-93c4-33a69026b848	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	6	94	94	Recife	2026-04-18 19:27:29.53097+00	Descartáveis
8dfbae0c-6f23-4931-9ff2-5f01d850a444	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	7	47	47	Recife	2026-04-18 19:27:29.53097+00	Descartáveis
a95c416e-857a-4c7b-b718-6ac4b3a8acd2	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	5	40	40	Recife	2026-04-18 19:27:29.53097+00	Fardamento
0c07d1ef-c430-4add-bb05-32550fa8449e	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	8aeb7806-f733-499e-b2b0-74856b551258	Touca	9	35	35	Recife	2026-04-18 19:27:29.53097+00	Fardamento
35ae2f21-01e9-4078-bec5-77153a456080	070bb0d9-7982-4500-9b6b-f9cdf60a9f3b	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	11	60	60	Recife	2026-04-18 19:27:29.53097+00	Fardamento
7009ba38-8515-4b7c-bbdb-b4c0ec7e39b4	93ca8de4-4817-4e26-b2e0-0768f8265d06	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	8	3.5	66.5	Recife	2026-04-18 19:47:55.853881+00	Empada Salgada
8385e5ca-57cb-47e6-ba85-c1bfdec033d7	40067f97-bfcc-4699-9631-2de6b0b160e3	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	5	3.5	66.5	Recife	2026-04-18 18:34:56.531687+00	Empada Salgada
1864b0a0-de83-4f92-8786-dffd244c959c	40067f97-bfcc-4699-9631-2de6b0b160e3	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	17	3.5	66.5	Recife	2026-04-18 18:34:56.531687+00	Empada Salgada
23fd167b-ebb3-4f77-85d8-4b337541253b	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	17	3.5	66.5	Recife	2026-04-18 19:00:38.754481+00	Empada Salgada
0b94cb42-8a6d-4930-a2dd-613de94eec2e	8b6c527f-ae6d-489a-a64f-2e24a7aab1c1	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	11	3.5	66.5	Recife	2026-04-18 19:00:38.754481+00	Empada Salgada
5579df86-4ee0-49c7-ac69-28c5da1bdb49	63ade416-8aac-4d69-beb7-af0529043a29	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	8	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
445424b9-a50c-4b6c-b58c-5b6167b96c27	63ade416-8aac-4d69-beb7-af0529043a29	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	8	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
67c4a99e-f131-4412-8590-96536ca9d9f5	63ade416-8aac-4d69-beb7-af0529043a29	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	14	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
99a36daa-eaf2-40b9-bf6e-aee4f9e81b76	63ade416-8aac-4d69-beb7-af0529043a29	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	15	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
267065e9-d43c-4813-89f0-734cfc324afa	63ade416-8aac-4d69-beb7-af0529043a29	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	13	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
daf5e576-60c3-4404-bdb1-8e75d8cd2728	63ade416-8aac-4d69-beb7-af0529043a29	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	15	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
060bd7da-a5ae-4490-9ba1-09115246b594	63ade416-8aac-4d69-beb7-af0529043a29	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	15	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
1eac4c38-b21c-4011-971d-dd452a652906	63ade416-8aac-4d69-beb7-af0529043a29	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	15	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
9da4812f-649c-473b-a5ee-a1e30b63ed4d	63ade416-8aac-4d69-beb7-af0529043a29	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	14	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
ce89e651-a8ca-48a1-8383-fde39c9318f5	63ade416-8aac-4d69-beb7-af0529043a29	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	9	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
fe512fb7-a59a-4797-9ebb-c69f9de06843	63ade416-8aac-4d69-beb7-af0529043a29	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	21	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
2d9bbf3e-8695-4165-bf42-b970ac9d3cff	63ade416-8aac-4d69-beb7-af0529043a29	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	14	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
76508ca7-23a7-4c20-aa64-96791f22bc50	63ade416-8aac-4d69-beb7-af0529043a29	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	18	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
bae0ace4-b8fc-4dc4-a8de-fbd3cab6891d	63ade416-8aac-4d69-beb7-af0529043a29	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	13	3.5	66.5	Recife	2026-04-18 19:34:01.983737+00	Empada Salgada
4f2d48f0-a63a-412d-8468-7e6a8d1fe595	63ade416-8aac-4d69-beb7-af0529043a29	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	13	3.5	63	Recife	2026-04-18 19:34:01.983737+00	Empadas Doces
aed881ab-bf7f-4d57-9ca5-dcda5c6c6dbb	63ade416-8aac-4d69-beb7-af0529043a29	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	8	3.5	63	Recife	2026-04-18 19:34:01.983737+00	Empadas Doces
79be5d06-a106-425b-9aa3-fce4deeeaa9f	63ade416-8aac-4d69-beb7-af0529043a29	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	9	3.5	63	Recife	2026-04-18 19:34:01.983737+00	Empadas Doces
7a9f15c9-7a95-4e63-b563-26937554cfef	63ade416-8aac-4d69-beb7-af0529043a29	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite	0.5	3.5	63	Recife	2026-04-18 19:34:01.983737+00	Empadas Doces
9e042f4a-5f50-4db0-9027-d3e3c6097edb	63ade416-8aac-4d69-beb7-af0529043a29	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado	14	2.4	63	Recife	2026-04-18 19:34:01.983737+00	Empadas Doces
13cd1e87-481a-41a0-8c7e-d2be91dfec9e	63ade416-8aac-4d69-beb7-af0529043a29	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão	7	4.42	53.04	Recife	2026-04-18 19:34:01.983737+00	Pastéis
162f89f5-711d-4b24-b533-55c6343ae380	63ade416-8aac-4d69-beb7-af0529043a29	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	8	5.3	63.6	Recife	2026-04-18 19:34:01.983737+00	Pastéis
1cd5ceb8-b448-46af-969a-587e64dfdea1	63ade416-8aac-4d69-beb7-af0529043a29	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	8	4.42	53.04	Recife	2026-04-18 19:34:01.983737+00	Pastéis
722ba3d5-aecb-471d-ab0e-6083c6fdd52d	63ade416-8aac-4d69-beb7-af0529043a29	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona	8	4.42	53.04	Recife	2026-04-18 19:34:01.983737+00	Pastéis
d8456947-8d73-482e-abd0-28e96a018e29	63ade416-8aac-4d69-beb7-af0529043a29	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	8	26	26	Recife	2026-04-18 19:34:01.983737+00	Descartáveis
412064ca-18be-488f-a206-39c1f7534591	63ade416-8aac-4d69-beb7-af0529043a29	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	8	130	130	Recife	2026-04-18 19:34:01.983737+00	Descartáveis
92dc7652-85b1-499a-9c9b-e1c6c11a65c6	63ade416-8aac-4d69-beb7-af0529043a29	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	4	3	3	Recife	2026-04-18 19:34:01.983737+00	Descartáveis
6b2fc584-a8c8-4595-8546-8e0bd7413d33	63ade416-8aac-4d69-beb7-af0529043a29	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	12	94	94	Recife	2026-04-18 19:34:01.983737+00	Descartáveis
3a4f3ceb-84e5-402f-82a6-0ad70982688a	63ade416-8aac-4d69-beb7-af0529043a29	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	12	47	47	Recife	2026-04-18 19:34:01.983737+00	Descartáveis
4856a757-995f-4162-8f30-4eb82eaa7e10	63ade416-8aac-4d69-beb7-af0529043a29	31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	4	40	40	Recife	2026-04-18 19:34:01.983737+00	Fardamento
96e13289-f5bd-4ddb-b212-3b74d12ad7e0	63ade416-8aac-4d69-beb7-af0529043a29	8aeb7806-f733-499e-b2b0-74856b551258	Touca	4	35	35	Recife	2026-04-18 19:34:01.983737+00	Fardamento
699c9007-f91f-4c86-b344-2b13bbffc1f0	63ade416-8aac-4d69-beb7-af0529043a29	6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental	7	60	60	Recife	2026-04-18 19:34:01.983737+00	Fardamento
f7ad8f03-1cb9-4918-a5d5-b96dac31d956	e8677825-253e-4998-941f-dc93367d09dc	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	16	3.5	66.5	Recife	2026-04-21 05:17:00.832999+00	Empada Salgada
1d03cfed-4dfa-452f-895d-e9db48eac4b3	b99c0f5a-fd87-49f1-ac96-b790b51ed696	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	15	3.5	66.5	Recife	2026-04-18 18:43:05.688321+00	Empada Salgada
dad32dcc-43e5-413a-aed6-a43d8a7aa568	bb55bcd5-ef7b-49b8-b607-aaac32426212	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	2	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
d41b08bf-e05a-4c29-b26f-abe72a419d62	bb55bcd5-ef7b-49b8-b607-aaac32426212	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	6	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
15eb801b-cf18-46c4-a340-786905c531dd	bb55bcd5-ef7b-49b8-b607-aaac32426212	cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon	2	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
ff948992-c75d-417a-81b1-bc11a1462251	bb55bcd5-ef7b-49b8-b607-aaac32426212	f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona	2	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
efd20a0e-a893-44b5-971d-8191e3461a93	bb55bcd5-ef7b-49b8-b607-aaac32426212	df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar	2	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
7ffb5a21-7f05-481d-b95b-50152ea211fc	bb55bcd5-ef7b-49b8-b607-aaac32426212	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	3	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
be168154-13b0-444e-9536-c6bc679e0b8f	bb55bcd5-ef7b-49b8-b607-aaac32426212	00fce467-49a7-4364-8711-974e449036b6	2 Queijos	4	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
0f539d50-1d83-437a-b3de-64a91cb1d5e6	bb55bcd5-ef7b-49b8-b607-aaac32426212	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	7	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
b66e6b1d-8ab7-43ed-8d6e-e551d6a3561f	bb55bcd5-ef7b-49b8-b607-aaac32426212	338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau	5	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
3c2f812b-34a4-40f9-bd49-137bb9b7a5b8	bb55bcd5-ef7b-49b8-b607-aaac32426212	cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque	6	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
11554ad5-525a-42b1-bae9-f20ff2b58177	bb55bcd5-ef7b-49b8-b607-aaac32426212	1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina	1	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
c0f4bf72-ea63-4544-9405-f2efe26dc8c1	bb55bcd5-ef7b-49b8-b607-aaac32426212	89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho	3	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
59f83ec1-e539-4273-a671-678604ade43b	bb55bcd5-ef7b-49b8-b607-aaac32426212	fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 	3	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
0efff5e2-20ff-44d4-91e7-3744d3121cf9	bb55bcd5-ef7b-49b8-b607-aaac32426212	87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró	2	3.5	7.99	Recife	2026-04-17 22:33:14.425801+00	
4e63bf0a-2200-4852-a891-341e3d2e72f3	bb55bcd5-ef7b-49b8-b607-aaac32426212	5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate	2	3.5	9.99	Recife	2026-04-17 22:33:14.425801+00	
f57a7218-991a-499e-bc5c-0265c777ec76	bb55bcd5-ef7b-49b8-b607-aaac32426212	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	2	3.5	9.99	Recife	2026-04-17 22:33:14.425801+00	
e3d58e3c-fd13-4f1e-8675-9b336635ab66	bb55bcd5-ef7b-49b8-b607-aaac32426212	dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Vazada	0.5	2.4	9.99	Recife	2026-04-17 22:33:14.425801+00	
96fbe820-2710-4ba6-b8d8-30cab86f40ac	bb55bcd5-ef7b-49b8-b607-aaac32426212	ed3b40af-8df1-46b4-9285-997fb16724e6	Banana	2	3.5	9.99	Recife	2026-04-17 22:33:14.425801+00	
92d8c47f-4447-4d44-8565-03848c3e6229	bb55bcd5-ef7b-49b8-b607-aaac32426212	c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta	1	3.5	9.99	Recife	2026-04-17 22:33:14.425801+00	
74153119-ff54-44b0-8e47-e0655502c2c4	bb55bcd5-ef7b-49b8-b607-aaac32426212	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão	9	5.3	12	Recife	2026-04-17 22:33:14.425801+00	
e9753b28-7fb2-4777-8afd-2d640ff791ab	bb55bcd5-ef7b-49b8-b607-aaac32426212	951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza	8	4.42	9.99	Recife	2026-04-17 22:33:14.425801+00	
697bab96-6044-46cb-b40b-8e3d32aa60ef	bb55bcd5-ef7b-49b8-b607-aaac32426212	6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango	16	4.42	9.99	Recife	2026-04-17 22:33:14.425801+00	
a58cc509-fabc-435f-9018-94060e2a2aeb	bb55bcd5-ef7b-49b8-b607-aaac32426212	2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne	7	4.42	9.99	Recife	2026-04-17 22:33:14.425801+00	
5ba64c8b-4873-44ec-b987-a25ed1b3cf2b	bb55bcd5-ef7b-49b8-b607-aaac32426212	f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas	4	26	26	Recife	2026-04-17 22:33:14.425801+00	
5a7bce88-b014-455c-8de1-bc15535eedd0	bb55bcd5-ef7b-49b8-b607-aaac32426212	6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos	1	130	130	Recife	2026-04-17 22:33:14.425801+00	
267d6f6e-538c-4f4d-9612-c1025b14172a	bb55bcd5-ef7b-49b8-b607-aaac32426212	16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery	6	3	3	Recife	2026-04-17 22:33:14.425801+00	
0a371b3f-c997-43c4-b5d0-bba4ff47f1b2	bb55bcd5-ef7b-49b8-b607-aaac32426212	7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande	1	94	94	Recife	2026-04-17 22:33:14.425801+00	
a2b48516-a475-466b-8fc6-79b3cd033fc9	bb55bcd5-ef7b-49b8-b607-aaac32426212	1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena	4	47	47	Recife	2026-04-17 22:33:14.425801+00	
d6313479-0ac4-4bcb-b07d-6cc43e669c53	b99c0f5a-fd87-49f1-ac96-b790b51ed696	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	11	3.5	66.5	Recife	2026-04-18 18:43:05.688321+00	Empada Salgada
604d5e66-7995-4512-9154-498447420642	b99c0f5a-fd87-49f1-ac96-b790b51ed696	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	4	3.5	66.5	Recife	2026-04-18 18:43:05.688321+00	Empada Salgada
738c7323-a17f-4289-b2c0-dd2d3f4272a7	b99c0f5a-fd87-49f1-ac96-b790b51ed696	665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão	4	5.3	63.6	Recife	2026-04-18 18:43:05.688321+00	Pastéis
d127d857-88e7-4c71-bbf7-8ff4d404e5d0	b99c0f5a-fd87-49f1-ac96-b790b51ed696	9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca	0.5	3.5	63	Recife	2026-04-18 18:43:05.688321+00	Empadas Doces
eacfbb02-4d0a-4e9e-ab61-66b5a80ce463	86929984-e922-47b2-a296-4b7f178ed819	95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito	3	3.5	66.5	Recife	2026-04-18 19:05:01.254245+00	Empada Salgada
d828c8af-4fd3-4272-b1e7-8fb987020121	86929984-e922-47b2-a296-4b7f178ed819	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	16	3.5	66.5	Recife	2026-04-18 19:05:01.254245+00	Empada Salgada
5394f117-bf18-422d-89bf-f11fa5863b8e	86929984-e922-47b2-a296-4b7f178ed819	c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão	16	3.5	66.5	Recife	2026-04-18 19:05:01.254245+00	Empada Salgada
f5305a68-dcf7-4fd0-a130-d89a4ef111c1	60631049-54e3-4f6b-a129-b26abd0a9e2d	a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro	6	3.5	66.5	Recife	2026-04-18 19:36:28.833134+00	Empada Salgada
f598e61a-c5ed-4830-b399-cb049b333d68	60631049-54e3-4f6b-a129-b26abd0a9e2d	60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão	11	3.5	66.5	Recife	2026-04-18 19:36:28.833134+00	Empada Salgada
\.


--
-- Data for Name: points; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.points (id, name, region, address, lat, lng, created_at) FROM stdin;
967b887e-2271-409e-83ad-2fa43e7bf471	Boa Viagem Store	Recife	Av. Boa Viagem, 1234	\N	\N	2026-04-16 12:14:00.981432+00
28ca9f48-46f6-4f4e-b27a-1be29ccb90a3	Shopping Recife	Recife	Av. Cais do Apolo, 300	\N	\N	2026-04-16 12:14:00.981432+00
889c311b-3f0b-4beb-bf0a-55e137f03c66	Olinda Terminal	Recife	Rua da Aurora, 456	\N	\N	2026-04-16 12:14:00.981432+00
c677edbc-3502-4f19-9398-694a8b791387	Salvador Centro	Salvador	Rua da Piedade, 789	\N	\N	2026-04-16 12:14:00.981432+00
3f5e54bf-82d6-4059-b44c-ed5877361e18	Shopping Paralela	Salvador	Av. Antônio Carlos Magalhães, 1000	\N	\N	2026-04-16 12:14:00.981432+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.products (id, name, description, category, cost_price, sell_price, region, created_at, sort_order) FROM stdin;
665526f8-b04d-4ea1-90d7-93ccbf238308	Camarão com Requeijão		Pastéis	5.30	63.60	Recife	2026-04-11 22:56:43.859564+00	9
951e3812-15a5-4728-9c1a-cfde7d6f95e8	Pizza		Pastéis	4.42	53.04	Recife	2026-04-11 22:57:17.91442+00	23
2a1dd748-57d6-4f74-b9ef-fcac6afd5c5d	Carne com Azeitona		Pastéis	4.42	53.04	Recife	2026-04-11 22:56:14.318964+00	999
6a77ab8e-9cac-4871-9b9d-eaa5cbccb516	Frango com Requeijão		Pastéis	4.42	53.04	Recife	2026-04-11 22:55:51.71636+00	999
dc13b5a7-1a66-4836-9b02-1f8ea6a1c065	Leite condensado		Empadas Doces	2.40	63.00	Recife	2026-04-11 23:08:55.929334+00	15
f15c0d42-ee28-4593-8c2d-b73b13661bd3	Forminhas		Descartáveis	26.00	26.00	Recife	2026-04-11 22:59:08.171375+00	999
6aab0e93-89ec-4668-848d-5763ef575b4a	Guardanapos		Descartáveis	130.00	130.00	Recife	2026-04-11 22:59:26.104971+00	999
31047a73-e5c7-4e8a-b650-471de8eb0a69	Camiseta	P e G	Fardamento	40.00	40.00	Recife	2026-04-11 22:59:56.273138+00	999
8aeb7806-f733-499e-b2b0-74856b551258	Touca		Fardamento	35.00	35.00	Recife	2026-04-11 23:00:10.562399+00	999
6e6acfae-0bba-4809-a37d-75dc7d0c0afd	Avental		Fardamento	60.00	60.00	Recife	2026-04-11 23:00:25.199511+00	999
16a19664-6b2a-449b-a551-babb77edc853	Caixa Delivery		Descartáveis	3.00	3.00	Recife	2026-04-11 22:58:39.73962+00	999
89ec3d05-6797-41b8-8bae-6076991fbf1d	Carne de Sol Queijo Coalho		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:50:48.651364+00	999
f078fce6-a323-4fe0-8512-95fa0ec74aa0	Frango com Azeitona		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:54:07.176379+00	999
6d188c63-cce3-468b-b376-132411c6aec7	Carne de Sol com Queijo Coalho		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:15.757296+00	999
98106a05-5263-4455-b0f9-3807e4c34add	Forminhas		Descartáveis	26.00	26.00	Salvador	2026-04-13 14:07:15.079011+00	999
8036b2b9-d2ec-4882-b831-5ee168b6e9ed	Guardanapos		Descartáveis	130.00	130.00	Salvador	2026-04-13 14:07:15.143236+00	999
ff3a0899-f2d7-401a-8792-1f74f4ef41b0	Camiseta	P e G	Fardamento	40.00	40.00	Salvador	2026-04-13 14:07:15.208768+00	999
20b50230-d0e6-42dd-952f-35ab6a9bcd2b	Touca		Fardamento	35.00	35.00	Salvador	2026-04-13 14:07:15.266574+00	999
1ec77a5d-93dd-4457-bb7e-56fe1b0c1cee	Avental		Fardamento	60.00	60.00	Salvador	2026-04-13 14:07:15.32309+00	999
3248d377-0ce2-4d9d-8f63-531a30be278f	Banana	com Doce de Leite	Empadas Doces	3.50	9.99	Salvador	2026-04-13 14:07:15.641328+00	999
7e5b1d5e-6f11-4f07-afd0-ef7d7a759d79	Embalagem Grande		Descartáveis	94.00	94.00	Recife	2026-04-11 22:58:14.207228+00	999
1d42fb1a-2a8c-4e32-ab4b-a412bad265ce	Embalagem Pequena		Descartáveis	47.00	47.00	Recife	2026-04-11 22:57:55.027307+00	999
13f454c5-38bf-4111-aa11-ded5d293b291	Caixa Delivery		Descartáveis	3.00	3.00	Salvador	2026-04-13 14:07:15.018195+00	999
17b9488f-9497-462e-afe6-5a704c552a8c	Embalagem Grande		Descartáveis	94.00	94.00	Salvador	2026-04-13 14:07:14.957119+00	999
4cc298ed-f6a4-45cc-a726-89771fa047f5	Embalagem Pequena		Descartáveis	47.00	47.00	Salvador	2026-04-13 14:07:14.898784+00	999
f7a381d2-e4e9-454a-adc1-e8af554cfb14	Frango com Azeitona		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:16.355983+00	999
5dcf6be3-f53f-4d29-934b-700de31a46db	Chocolate		Empadas Doces	3.50	63.00	Recife	2026-04-11 23:09:23.188579+00	16
87de823c-38bc-4581-8fad-be175aa106b1	Charque		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:15.814286+00	12
458911b4-367f-42ed-b892-4df58d879cc0	Bacalhau		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:15.87197+00	11
77992f92-f2f2-4617-b83a-b901308aa491	Camarão 		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:15.926754+00	9
9367999f-6892-449f-85f5-e8d8edbafa6f	Paçoca		Empadas Doces	3.50	63.00	Recife	2026-04-11 23:10:31.364356+00	17
c7e9db73-dcd4-4b6c-be37-669f925d31f8	Romeu e Julieta		Empadas Doces	3.50	63.00	Recife	2026-04-11 23:10:58.317809+00	18
ed3b40af-8df1-46b4-9285-997fb16724e6	Banana com Doce de Leite		Empadas Doces	3.50	63.00	Recife	2026-04-11 23:11:20.869391+00	999
08d2f2b7-c23f-47aa-9094-6432014f0b1b	Frango Puro		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:16.176213+00	2
7f7d2229-d01f-4287-99b2-518297681c64	Frango com Requeijão		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:16.102597+00	22
3afff7e8-8554-4550-b15b-f7242ebae859	Carne com Azeitona		Pastéis	4.42	9.99	Salvador	2026-04-13 14:07:14.716085+00	21
bca44ed5-a1fa-49c3-ba7f-494e038e1384	Pizza		Pastéis	4.42	9.99	Salvador	2026-04-13 14:07:14.835681+00	23
03dfda97-321e-487d-872a-18af390a4f51	Vazada		Empadas Doces	2.40	9.99	Salvador	2026-04-13 14:07:15.403439+00	15
228168dc-a198-4a05-8e1e-aaf14fbad796	Chocolate		Empadas Doces	3.50	9.99	Salvador	2026-04-13 14:07:15.464041+00	16
25025576-8de3-44b6-9230-6ae2fb7549e5	Paçoca		Empadas Doces	3.50	9.99	Salvador	2026-04-13 14:07:15.521668+00	17
ca183e17-eac1-42b4-b69f-ab626c423401	Romeu e Julieta		Empadas Doces	3.50	9.99	Salvador	2026-04-13 14:07:15.578345+00	18
8fc35ec3-d5ef-46e4-b4d0-0c95da1122b8	Nordestina		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:15.698805+00	14
a5b62f9b-de2d-44b3-b2ce-fc704bc81dc9	2 Queijos		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:15.985056+00	8
d8b6b201-78e9-480e-82e2-a6a7aaaba539	Alho poró		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:16.042925+00	7
d36c4506-e182-4e90-b39e-fd346d5476e0	Palmito		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:16.241194+00	1
8f3b4fc9-8edf-4ed7-90fc-060eb74b58ad	Camarão com Requeijão		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:16.4718+00	20
885cc9b1-622f-483c-b81c-44ba8b2f1db8	Frango com Cheddar		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:16.412565+00	5
d61b1205-0899-43e0-827e-459a20578d40	Frango com Bacon		Empada Salgada	3.50	7.99	Salvador	2026-04-13 14:07:16.297228+00	3
18c99098-b053-4faf-b0c8-0d46c1e2ebaa	Frango com Requeijão		Pastéis	4.42	9.99	Salvador	2026-04-13 14:07:14.655437+00	22
fe647bcb-f5a3-4e56-a5ee-e7d00b42a1f4	Camarão com Requeijão		Pastéis	5.30	12.00	Salvador	2026-04-13 14:07:14.776541+00	20
00fce467-49a7-4364-8711-974e449036b6	2 Queijos		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:52:35.236004+00	8
58ef98a5-b2a8-4edf-81a2-7cd4ac3dc919	Entrega extra	Taxa de entrega extra	Descartáveis	0	0	Salvador	2026-04-17 18:39:21.097297+00	999
fb6715fa-8375-4725-8d80-7d23c15e1c43	Camarão 		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:51:53.619186+00	9
338e5f0c-aebf-4714-a2aa-ffc238da3d77	Bacalhau		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:51:34.014303+00	11
ab70f497-6f2c-443a-aca0-3b30677b81a0	Entrega Fora de Horario		Entrega extra	50.00	50.00	Recife	2026-04-17 20:56:50.278937+00	999
c6b141b0-ec66-4b3f-9f74-339c86e2beb7	Natal com João Pessoa		Entrega extra	350.00	350.00	Recife	2026-04-17 20:49:49.834345+00	999
4efc2190-0f37-49eb-a9aa-f18c09fcc0bd	Natal Sem João Pessoa		Entrega extra	150.00	150.00	Recife	2026-04-17 20:49:05.887148+00	999
ae4e57c6-8c36-4473-8860-f04ea12b9d70	Arapiraca sem Maceió		Entrega extra	250.00	250.00	Recife	2026-04-17 20:50:19.385482+00	999
89df865a-605d-4488-bb00-b1048c479ca0	Recife - Domingos e Feriados		Entrega extra	50.00	50.00	Recife	2026-04-17 20:51:18.107805+00	999
9816a0ac-4064-4e03-a491-134dec7043c9	João Pessoa - Domingos e Feriados		Entrega extra	100.00	100.00	Recife	2026-04-17 20:51:59.032551+00	999
95c54eac-369f-401d-b4c4-040cedf643a6	Campina Grande - Domingos e feriados		Entrega extra	150.00	150.00	Recife	2026-04-17 20:50:44.783852+00	999
3aea2926-306f-45a1-bffa-c9bd713226ae	Caruaru - Domingos e Feriados		Entrega extra	100.00	100.00	Recife	2026-04-17 20:55:09.350686+00	999
e1c0a44c-b336-463e-8a91-2ffb5183a7a9	Entrega extra		Entrega extra	0	0	Recife	2026-04-17 20:58:19.766239+00	999
95b3dfbd-4805-492f-9f41-09b57d79141f	Palmito		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:54:50.678915+00	1
a5959c8c-6231-48dc-8a51-71e0187f7c5c	Frango Puro		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:54:38.866533+00	2
cba73583-caeb-402f-b6eb-7e35ab1ee1b2	Frango com Bacon		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:54:24.657668+00	3
cd5843a8-6d5b-4418-8b4e-4b41eff27eeb	Charque		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:51:16.330276+00	12
df51c2f0-bec4-44ab-81f8-faca2aa15269	Frango com Cheddar		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:53:50.292258+00	5
87a295ba-1d25-4e38-b196-0025abd9fa68	Alho poró		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:53:04.707865+00	7
1e81f6be-2748-4ee1-8485-d453963ee898	Nordestina		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:50:16.538057+00	14
c8d9b233-9014-4d0e-b79a-8cbb521cf117	Camarão com Requeijão		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:52:16.839433+00	20
60ab7978-1b2f-4470-843d-9578146ec993	Frango com Requeijão		Empada Salgada	3.50	66.50	Recife	2026-04-11 22:53:29.969896+00	22
\.


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.schedules (id, title, location, scheduled_date, scheduled_time, vehicle_id, vehicle_name, driver_id, driver_name, region, status, color, stops_count, order_ids, created_at) FROM stdin;
eb0d4a18-4ae3-4dd5-a7ad-66ca85131688	Rota Manhã	Boa Viagem Store	2026-04-20	08:00	\N	Caminhão RX-22	\N	Carlos Oliveira	Recife	Ativa	secondary	3	{}	2026-04-19 18:42:54.715751+00
b46eaef9-0a7e-4af1-b832-52954b00f16e	Reposição Estoque	Shopping Recife	2026-04-21	10:30	\N	Van VX-01	\N	Roberto Silva	Recife	Ativa	primary	2	{}	2026-04-19 18:42:54.715751+00
f876f920-6296-4134-81cc-de96b60b388f	Rota Salvador Centro	Pelourinho Store	2026-04-20	09:00	\N	Van SV-01	\N	João Santos	Salvador	Ativa	primary	4	{}	2026-04-19 18:42:54.715751+00
2765a547-5731-4e1d-9d43-d223c237cb9c	Rota Padrão	Shopping Pátio	2026-04-20	05:48	9579ac02-2a7a-4fa1-b6e0-5598f136f2dd	Strada IZZ3I65	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Recife	Ativa	primary	1	{}	2026-04-19 18:48:08.762463+00
89182662-1342-4cfd-8fb5-ff93c6811538	Rota Padrão	Shopping Pátio	2026-04-21	15:50	c3fc630c-17c5-41b3-90aa-3c455ff71123	Strada PLN1I63	cba34273-a0c6-4045-82d8-d877af385c2f	Tulio Motorista	Recife	Ativa	primary	1	{}	2026-04-19 18:50:54.913724+00
e7c66a47-a21f-4e8f-8174-59c9515868de	Rota Padrão	Parque Shopping Maceió	2026-04-21	07:14	f043f0f1-93f3-45e7-8687-1a8c61fa3429	Bongo RPG1G71	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Recife	Ativa	primary	1	{}	2026-04-20 10:15:03.65029+00
e4330b07-5900-4b4f-9cb1-48cd513be104	Rota Padrão	Parque Shopping Maceió	2026-04-21	08:03	9579ac02-2a7a-4fa1-b6e0-5598f136f2dd	Strada IZZ3I65	22da979a-4e00-48e8-8e0e-6654f8c590bc	Oseas Arcanjo	Recife	Ativa	primary	1	{}	2026-04-20 11:03:17.699439+00
\.


--
-- Data for Name: transfers; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.transfers (id, origin, destination, items, total_items, status, created_at) FROM stdin;
cdd768d5-9309-4a89-9e2e-123ac38cfc74	Recife	Salvador	[{"name": "Palmito", "quantity": 1, "productId": "95b3dfbd-4805-492f-9f41-09b57d79141f"}]	1	Concluído	2026-04-17 21:49:43.395987+00
69800941-c23b-4c4e-befe-875e5f0378b8	Salvador	Recife	[{"name": "Palmito", "quantity": 40, "productId": "d36c4506-e182-4e90-b39e-fd346d5476e0"}, {"name": "Frango Puro", "quantity": 175, "productId": "08d2f2b7-c23f-47aa-9094-6432014f0b1b"}, {"name": "Frango com Bacon", "quantity": 60, "productId": "d61b1205-0899-43e0-827e-459a20578d40"}, {"name": "Frango com Azeitona", "quantity": 50, "productId": "f7a381d2-e4e9-454a-adc1-e8af554cfb14"}, {"name": "Frango com Cheddar", "quantity": 50, "productId": "885cc9b1-622f-483c-b81c-44ba8b2f1db8"}, {"name": "Frango com Requeijão", "quantity": 190, "productId": "7f7d2229-d01f-4287-99b2-518297681c64"}, {"name": "Alho poró", "quantity": 40, "productId": "d8b6b201-78e9-480e-82e2-a6a7aaaba539"}, {"name": "2 Queijos", "quantity": 100, "productId": "a5b62f9b-de2d-44b3-b2ce-fc704bc81dc9"}, {"name": "Camarão ", "quantity": 210, "productId": "77992f92-f2f2-4617-b83a-b901308aa491"}, {"name": "Camarão com Requeijão", "quantity": 200, "productId": "8f3b4fc9-8edf-4ed7-90fc-060eb74b58ad"}, {"name": "Bacalhau", "quantity": 150, "productId": "458911b4-367f-42ed-b892-4df58d879cc0"}, {"name": "Carne de Sol com Queijo Coalho", "quantity": 140, "productId": "6d188c63-cce3-468b-b376-132411c6aec7"}, {"name": "Nordestina", "quantity": 40, "productId": "8fc35ec3-d5ef-46e4-b4d0-0c95da1122b8"}, {"name": "Charque", "quantity": 120, "productId": "87de823c-38bc-4581-8fad-be175aa106b1"}, {"name": "Paçoca", "quantity": 30, "productId": "25025576-8de3-44b6-9230-6ae2fb7549e5"}, {"name": "Chocolate", "quantity": 35, "productId": "228168dc-a198-4a05-8e1e-aaf14fbad796"}, {"name": "Romeu e Julieta", "quantity": 30, "productId": "ca183e17-eac1-42b4-b69f-ab626c423401"}, {"name": "Vazada", "quantity": 160, "productId": "03dfda97-321e-487d-872a-18af390a4f51"}, {"name": "Banana", "quantity": 30, "productId": "3248d377-0ce2-4d9d-8f63-531a30be278f"}, {"name": "Frango com Requeijão", "quantity": 450, "productId": "18c99098-b053-4faf-b0c8-0d46c1e2ebaa"}, {"name": "Camarão com Requeijão", "quantity": 370, "productId": "fe647bcb-f5a3-4e56-a5ee-e7d00b42a1f4"}, {"name": "Carne com Azeitona", "quantity": 340, "productId": "3afff7e8-8554-4550-b15b-f7242ebae859"}, {"name": "Pizza", "quantity": 150, "productId": "bca44ed5-a1fa-49c3-ba7f-494e038e1384"}, {"name": "Forminhas", "quantity": 1, "productId": "98106a05-5263-4455-b0f9-3807e4c34add"}, {"name": "Guardanapos", "quantity": 6, "productId": "8036b2b9-d2ec-4882-b831-5ee168b6e9ed"}, {"name": "Embalagem Grande", "quantity": 6, "productId": "17b9488f-9497-462e-afe6-5a704c552a8c"}, {"name": "Embalagem Pequena", "quantity": 6, "productId": "4cc298ed-f6a4-45cc-a726-89771fa047f5"}]	3179	Concluído	2026-04-17 23:11:35.27186+00
\.


--
-- Data for Name: vehicle_checklists; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.vehicle_checklists (id, driver_id, vehicle, km, checks, photos, observations, status, region, created_at) FROM stdin;
fbc49666-7c1a-4809-a591-bc31b2416cbe	cba34273-a0c6-4045-82d8-d877af385c2f	Fiat Strada - PLN1I63	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776291517271-0.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776291517277-1.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776291517277-2.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776291517277-3.PNG}		problem	Recife	2026-04-15 22:18:38.315993+00
8aed2d30-614a-412c-82d1-10b9ebeb7b75	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776292253819-0.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776292253819-1.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776292253819-2.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776292253819-3.jpg}		problem	Recife	2026-04-15 22:30:54.803599+00
cfb92a91-e180-490c-beba-9f5aae073da5	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776292725986-0.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776292725987-1.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776292725987-2.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776292725987-3.jpeg}		problem	Recife	2026-04-15 22:38:47.037425+00
2b876a61-f56a-4fd5-80bb-93ed6a55e0da	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293397823-0.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293397823-1.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293397823-2.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293397823-3.jpg}		problem	Recife	2026-04-15 22:49:58.907567+00
0defe8f5-7df3-401e-8cb7-e38861600426	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293628585-0.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293628585-1.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293628585-2.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293628585-3.jpg}		problem	Recife	2026-04-15 22:53:49.64377+00
1ee5b746-c08b-4d16-9e7a-c21eddc167b9	cba34273-a0c6-4045-82d8-d877af385c2f	Fiat Strada - PLN1I63	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293807766-0.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293807767-1.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293807767-2.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/anon/checklist-1776293807767-3.PNG}		problem	Recife	2026-04-15 22:56:48.828476+00
25df80bb-3d7b-491f-8c29-4aadd904e010	cba34273-a0c6-4045-82d8-d877af385c2f	Fiat Strada - PLN1I63	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776297271820-0.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776297271821-1.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776297271821-2.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776297271821-3.PNG}		problem	Recife	2026-04-15 23:54:32.975648+00
125aebd4-42c3-4613-915f-7537a99984b1	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	12356	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776305419963-0.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776305419965-1.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776305419965-2.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776305419965-3.PNG}		problem	Recife	2026-04-16 02:10:21.219232+00
15003c3e-172e-4253-ba56-0b527e2aca56	cba34273-a0c6-4045-82d8-d877af385c2f	Fiat Strada - IZZ3I65	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776341794259-0.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776341794260-1.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776341794260-2.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776341794260-3.jpg}		problem	Recife	2026-04-16 12:16:35.431704+00
8313f615-dd6b-4046-9560-80dcc44b30a1	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	23456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776373832819-0.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776373832819-1.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776373832819-2.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776373832819-3.PNG}		problem	Recife	2026-04-16 21:10:34.389774+00
6dbd5ae6-0041-4987-b373-c9a5757e910f	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776374473605-0.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776374473606-1.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776374473606-2.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776374473606-3.PNG}		problem	Recife	2026-04-16 21:21:15.261883+00
2f7e9d93-a00d-4262-b152-327975aa7b33	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776558859086-0.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776558859089-1.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776558859089-2.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776558859089-3.jpg}	teste do veiculo	problem	Recife	2026-04-19 00:34:20.28626+00
73829357-0343-49ec-ac97-7167b0f30614	cba34273-a0c6-4045-82d8-d877af385c2f	Fiat Strada - PLN1I63	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776611014493-0.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776611014497-1.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776611014498-2.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776611014498-3.jpeg}		problem	Recife	2026-04-19 15:03:38.844739+00
1cfe459a-c6e4-45ae-b5c9-0595bebc05fa	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621217330-0.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621217332-1.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621217332-2.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621217332-3.jpg}		problem	Recife	2026-04-19 17:53:37.905785+00
20dbd60c-911f-45ef-9318-08973df3bf5e	cba34273-a0c6-4045-82d8-d877af385c2f	KIA Bongo - RPG1G71	12345698	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621912763-0.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621912764-1.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621912764-2.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621912764-3.jpeg}		problem	Recife	2026-04-19 18:05:13.482659+00
c8099bb8-a3f9-4c52-b15c-cf813ad7c377	22da979a-4e00-48e8-8e0e-6654f8c590bc	Fiat Strada - IZZ3I65	12345	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/22da979a-4e00-48e8-8e0e-6654f8c590bc/checklist-1776629510004-0.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/22da979a-4e00-48e8-8e0e-6654f8c590bc/checklist-1776629510005-1.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/22da979a-4e00-48e8-8e0e-6654f8c590bc/checklist-1776629510005-2.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/22da979a-4e00-48e8-8e0e-6654f8c590bc/checklist-1776629510005-3.PNG}		problem	Recife	2026-04-19 20:11:50.853311+00
53726842-4a8f-4707-bc4a-3f933e3cc45e	d3720269-de76-4244-ac07-9a0cc3b81da6	Fiat Strada - PLN1I63	123456	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776680263568-0.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776680263572-1.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776680263572-2.jpeg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776680263572-3.jpg}		problem	Recife	2026-04-20 10:17:46.521341+00
792fac82-ee61-4018-97b7-070464dddb4a	d3720269-de76-4244-ac07-9a0cc3b81da6	Fiat Strada - PLN1I63	12345689	{"oleo": "problem", "pneus": "problem", "farois": "ok", "agua_limpador": "ok", "agua_radiador": "ok"}	{http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776693238008-0.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776693238010-1.PNG,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776693238010-2.jpg,http://72.60.61.216:8000/storage/v1/object/public/checklist-photos/d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776693238010-3.jpeg}		problem	Recife	2026-04-20 13:53:59.130094+00
\.


--
-- Data for Name: messages_2026_04_18; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_04_18 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_04_19; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_04_19 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_04_20; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_04_20 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_04_21; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_04_21 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_04_22; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_04_22 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_04_23; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_04_23 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_04_24; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_04_24 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-04-10 11:29:28
20211116045059	2026-04-10 11:29:28
20211116050929	2026-04-10 11:29:28
20211116051442	2026-04-10 11:29:28
20211116212300	2026-04-10 11:29:28
20211116213355	2026-04-10 11:29:28
20211116213934	2026-04-10 11:29:28
20211116214523	2026-04-10 11:29:28
20211122062447	2026-04-10 11:29:28
20211124070109	2026-04-10 11:29:28
20211202204204	2026-04-10 11:29:28
20211202204605	2026-04-10 11:29:28
20211210212804	2026-04-10 11:29:28
20211228014915	2026-04-10 11:29:28
20220107221237	2026-04-10 11:29:28
20220228202821	2026-04-10 11:29:28
20220312004840	2026-04-10 11:29:28
20220603231003	2026-04-10 11:29:28
20220603232444	2026-04-10 11:29:28
20220615214548	2026-04-10 11:29:28
20220712093339	2026-04-10 11:29:28
20220908172859	2026-04-10 11:29:28
20220916233421	2026-04-10 11:29:28
20230119133233	2026-04-10 11:29:28
20230128025114	2026-04-10 11:29:28
20230128025212	2026-04-10 11:29:28
20230227211149	2026-04-10 11:29:28
20230228184745	2026-04-10 11:29:28
20230308225145	2026-04-10 11:29:28
20230328144023	2026-04-10 11:29:28
20231018144023	2026-04-10 11:29:28
20231204144023	2026-04-10 11:29:28
20231204144024	2026-04-10 11:29:28
20231204144025	2026-04-10 11:29:28
20240108234812	2026-04-10 11:29:28
20240109165339	2026-04-10 11:29:28
20240227174441	2026-04-10 11:29:28
20240311171622	2026-04-10 11:29:28
20240321100241	2026-04-10 11:29:29
20240401105812	2026-04-10 11:29:29
20240418121054	2026-04-10 11:29:29
20240523004032	2026-04-10 11:29:29
20240618124746	2026-04-10 11:29:29
20240801235015	2026-04-10 11:29:29
20240805133720	2026-04-10 11:29:29
20240827160934	2026-04-10 11:29:29
20240919163303	2026-04-10 11:29:29
20240919163305	2026-04-10 11:29:29
20241019105805	2026-04-10 11:29:29
20241030150047	2026-04-10 11:29:29
20241108114728	2026-04-10 11:29:29
20241121104152	2026-04-10 11:29:29
20241130184212	2026-04-10 11:29:29
20241220035512	2026-04-10 11:29:29
20241220123912	2026-04-10 11:29:29
20241224161212	2026-04-10 11:29:29
20250107150512	2026-04-10 11:29:29
20250110162412	2026-04-10 11:29:29
20250123174212	2026-04-10 11:29:29
20250128220012	2026-04-10 11:29:29
20250506224012	2026-04-10 11:29:29
20250523164012	2026-04-10 11:29:29
20250714121412	2026-04-10 11:29:29
20250905041441	2026-04-10 11:29:29
20251103001201	2026-04-10 11:29:29
20251120212548	2026-04-10 11:29:29
20251120215549	2026-04-10 11:29:29
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
checklist-photos	checklist-photos	\N	2026-04-11 23:37:35.652549+00	2026-04-11 23:37:35.652549+00	t	f	\N	\N	\N	STANDARD
vehicle-photos	vehicle-photos	\N	2026-04-13 12:29:49.266712+00	2026-04-13 12:29:49.266712+00	t	f	\N	\N	\N	STANDARD
delivery-photos	delivery-photos	\N	2026-04-13 12:29:49.266712+00	2026-04-13 12:29:49.266712+00	t	f	\N	\N	\N	STANDARD
pedidos	pedidos	\N	2026-04-16 01:58:40.485711+00	2026-04-16 01:58:40.485711+00	t	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.iceberg_namespaces (id, bucket_name, name, created_at, updated_at, metadata, catalog_id) FROM stdin;
\.


--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.iceberg_tables (id, namespace_id, bucket_name, name, location, created_at, updated_at, remote_table_id, shard_key, shard_id, catalog_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-04-10 11:29:28.374009
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-04-10 11:29:28.387524
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-04-10 11:29:28.393429
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-04-10 11:29:28.422661
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-04-10 11:29:28.460006
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-04-10 11:29:28.467411
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-04-10 11:29:28.473243
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-04-10 11:29:28.481362
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-04-10 11:29:28.489947
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-04-10 11:29:28.494636
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-04-10 11:29:28.500684
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-04-10 11:29:28.50735
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-04-10 11:29:28.514566
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-04-10 11:29:28.522196
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-04-10 11:29:28.52763
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-04-10 11:29:28.580577
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-04-10 11:29:28.585331
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-04-10 11:29:28.588386
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-04-10 11:29:28.591682
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-04-10 11:29:28.59578
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-04-10 11:29:28.598775
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-04-10 11:29:28.612742
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-04-10 11:29:28.645196
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-04-10 11:29:28.668432
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-04-10 11:29:28.673244
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-04-10 11:29:28.676089
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-04-10 11:29:28.679758
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-04-10 11:29:28.684413
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-04-10 11:29:28.687316
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-04-10 11:29:28.689393
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-04-10 11:29:28.692387
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-04-10 11:29:28.694585
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-04-10 11:29:28.697749
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-04-10 11:29:28.703144
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-04-10 11:29:28.705757
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-04-10 11:29:28.709257
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-04-10 11:29:28.712262
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-04-10 11:29:28.71561
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-04-10 11:29:28.719592
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-04-10 11:29:28.755619
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-04-10 11:29:28.758567
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-04-10 11:29:28.761677
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-04-10 11:29:28.765852
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-04-10 11:29:28.771309
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-04-10 11:29:28.776728
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-04-10 11:29:28.786993
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-04-10 11:29:28.812269
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-04-10 11:29:28.815896
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-04-10 11:29:28.81939
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-04-10 11:29:28.877836
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-04-10 11:29:28.885815
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-04-10 11:29:29.050936
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-04-10 11:29:29.053524
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-04-10 11:29:29.066465
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-04-10 11:29:29.07369
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-04-10 11:29:29.075949
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-04-10 11:29:29.083018
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-04-10 11:29:29.088004
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-04-10 11:29:29.092874
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
8cba1835-f334-42ca-ba87-7ad46d55da01	vehicle-photos	1776083399124_PLN1I63.PNG	\N	2026-04-13 12:30:03.403896+00	2026-04-13 12:30:03.403896+00	2026-04-13 12:30:03.403896+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-13T12:30:03.343Z", "contentLength": 788666, "httpStatusCode": 200}	f2613e7c-23c6-4c33-8ae1-0f60458831ee	\N	{}
9c9f88a0-a258-42d7-a755-4caa7f2fe54f	vehicle-photos	1776192870070_PLN1I63.PNG	\N	2026-04-14 18:54:30.900757+00	2026-04-14 18:54:30.900757+00	2026-04-14 18:54:30.900757+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-14T18:54:30.885Z", "contentLength": 788666, "httpStatusCode": 200}	827b361c-ffec-4603-aa18-db6b1149257b	\N	{}
cf4e4044-08e1-4b23-a00f-daf4fb74d016	checklist-photos	anon/checklist-1776293397823-0.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:49:58.74813+00	2026-04-15 22:49:58.74813+00	2026-04-15 22:49:58.74813+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:49:58.744Z", "contentLength": 87428, "httpStatusCode": 200}	53414d5b-d4ff-40a9-8ac0-b81a844893cc	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
087c481a-cebd-4f11-8b63-d3d852550f30	vehicle-photos	1776193053375_PLN1I63.PNG	\N	2026-04-14 18:57:33.978736+00	2026-04-14 18:57:33.978736+00	2026-04-14 18:57:33.978736+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-14T18:57:33.972Z", "contentLength": 788666, "httpStatusCode": 200}	92f9dd10-826e-42b9-9ad4-2bca99f6a6ed	\N	{}
6425c5e6-5cd6-4173-a8b8-b8ff8c41b898	checklist-photos	anon/checklist-1776293807767-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:56:48.696969+00	2026-04-15 22:56:48.696969+00	2026-04-15 22:56:48.696969+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:56:48.684Z", "contentLength": 44512, "httpStatusCode": 200}	2c1507ff-c3dd-41aa-968d-41b8a4bd996e	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
4c3cc651-2c65-4d6c-9acc-a8bf23bb728d	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621217330-0.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 17:53:37.67992+00	2026-04-19 17:53:37.67992+00	2026-04-19 17:53:37.67992+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T17:53:37.673Z", "contentLength": 148343, "httpStatusCode": 200}	a162f72d-5834-4114-ad1c-042b856dc72f	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
02847926-3c07-4bc7-8b0a-1ee57f87f359	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296134035-2.PNG	\N	2026-04-15 23:35:34.966734+00	2026-04-15 23:35:34.966734+00	2026-04-15 23:35:34.966734+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:35:34.962Z", "contentLength": 87428, "httpStatusCode": 200}	13dd1328-3666-45b7-b02e-78bbd2c0292b	\N	{}
11d0152f-604d-4a54-b424-0d3187d7ecf3	checklist-photos	anon/checklist-1776288383353-0.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:26:24.734689+00	2026-04-15 21:26:24.734689+00	2026-04-15 21:26:24.734689+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:26:24.347Z", "contentLength": 44512, "httpStatusCode": 200}	f04f3b99-6aae-4546-aaea-0d566df48043	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
2ef9ae1b-17a4-4ac3-8164-2a5d7bcd4bcd	checklist-photos	anon/checklist-1776288383354-2.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:26:24.769977+00	2026-04-15 21:26:24.769977+00	2026-04-15 21:26:24.769977+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:26:24.679Z", "contentLength": 148343, "httpStatusCode": 200}	eedf5218-c7da-4de3-90a2-439ce830c61d	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
2c2d6fd2-0b17-4090-b3ca-1ba5ce990a20	checklist-photos	anon/checklist-1776288383354-1.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:26:24.885587+00	2026-04-15 21:26:24.885587+00	2026-04-15 21:26:24.885587+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:26:24.711Z", "contentLength": 16312, "httpStatusCode": 200}	836679ea-39d3-4b9a-b817-0d51900b71ec	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
78818364-8ef0-4dfe-8a89-46eaf6ff5969	checklist-photos	anon/checklist-1776288383354-3.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:26:25.097238+00	2026-04-15 21:26:25.097238+00	2026-04-15 21:26:25.097238+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:26:25.084Z", "contentLength": 788666, "httpStatusCode": 200}	375c9b4f-15a0-486c-a1a6-d5e9996f6e47	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
4835c49b-d39e-4178-b911-7729c80c9b74	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776288555378-0.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:29:16.1007+00	2026-04-15 21:29:16.1007+00	2026-04-15 21:29:16.1007+00	{"eTag": "\\"4fcbf90d2166b4b199c49a1b02395ccb\\"", "size": 60304, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:29:16.097Z", "contentLength": 60304, "httpStatusCode": 200}	d1e93628-4266-44f5-af05-f749ed939ca7	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
8ccacf41-cd44-4877-b5c6-5b28fa178016	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776288555378-3.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:29:16.233807+00	2026-04-15 21:29:16.233807+00	2026-04-15 21:29:16.233807+00	{"eTag": "\\"580a3ede5ea7b2859a6ecd4b7dbbe336\\"", "size": 40148, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:29:16.229Z", "contentLength": 40148, "httpStatusCode": 200}	86ca82ca-9a9b-404e-b602-ab4ed22220a7	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
c04fc1c3-c66e-440a-b49c-6770cda43de2	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776288555378-1.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:29:16.281466+00	2026-04-15 21:29:16.281466+00	2026-04-15 21:29:16.281466+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:29:16.276Z", "contentLength": 148343, "httpStatusCode": 200}	2af26220-67c2-43c5-9938-94f98ee12126	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
d07a4ed9-c537-436f-b138-822d22aa136a	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621217332-2.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 17:53:37.660663+00	2026-04-19 17:53:37.660663+00	2026-04-19 17:53:37.660663+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T17:53:37.654Z", "contentLength": 16312, "httpStatusCode": 200}	04958d40-fd48-4bb2-a96a-01f8d4aeb322	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
83969c17-7bec-4c37-af08-fa1d90eb79c4	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776288555378-2.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:29:16.486401+00	2026-04-15 21:29:16.486401+00	2026-04-15 21:29:16.486401+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:29:16.479Z", "contentLength": 788666, "httpStatusCode": 200}	639c932f-7764-490d-9ea4-50549ca4af46	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
40f37341-b5e6-40b3-a59e-7cb7be838830	checklist-photos	anon/checklist-1776293397823-1.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:49:58.74341+00	2026-04-15 22:49:58.74341+00	2026-04-15 22:49:58.74341+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:49:58.736Z", "contentLength": 87428, "httpStatusCode": 200}	68b169c9-4dae-4f0d-a0b4-4ac5596e58f0	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
62a2320c-598b-43ca-9db3-687d6451f4f8	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776288967983-3.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:36:08.822885+00	2026-04-15 21:36:08.822885+00	2026-04-15 21:36:08.822885+00	{"eTag": "\\"580a3ede5ea7b2859a6ecd4b7dbbe336\\"", "size": 40148, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:36:08.816Z", "contentLength": 40148, "httpStatusCode": 200}	f304910f-68c0-48f1-9fff-15b9446aabef	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
efacd8c4-ee9c-4936-9765-f199af75d07b	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776288967982-0.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:36:08.882999+00	2026-04-15 21:36:08.882999+00	2026-04-15 21:36:08.882999+00	{"eTag": "\\"4fcbf90d2166b4b199c49a1b02395ccb\\"", "size": 60304, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:36:08.876Z", "contentLength": 60304, "httpStatusCode": 200}	4bc32468-610c-449e-a9bb-a4b524dae6ac	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
d296d7c4-906a-4a39-bfe8-90e0ce1ab6bf	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776294688765-2.jpeg	\N	2026-04-15 23:11:29.611141+00	2026-04-15 23:11:29.611141+00	2026-04-15 23:11:29.611141+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:11:29.609Z", "contentLength": 16312, "httpStatusCode": 200}	b8ba46b9-e304-4694-ae8e-fc1f2e9c8651	\N	{}
6177e6df-fa1b-4c77-98b1-a4f0ad0911d5	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776288967983-1.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:36:08.939185+00	2026-04-15 21:36:08.939185+00	2026-04-15 21:36:08.939185+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:36:08.933Z", "contentLength": 148343, "httpStatusCode": 200}	48ee067b-c314-4454-98fb-adc6116f916e	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
80bf002b-045f-4a13-b2a2-21a1c5b11d9a	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776288967983-2.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:36:09.106582+00	2026-04-15 21:36:09.106582+00	2026-04-15 21:36:09.106582+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:36:09.098Z", "contentLength": 788666, "httpStatusCode": 200}	5d422061-629b-48b7-88ca-82cfed0856c2	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
fd59d467-fb45-499b-9a5c-1b801b6ab053	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776294688765-3.jpg	\N	2026-04-15 23:11:29.641376+00	2026-04-15 23:11:29.641376+00	2026-04-15 23:11:29.641376+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:11:29.635Z", "contentLength": 44512, "httpStatusCode": 200}	5a6062fe-6b22-4ace-8cfc-fcfb665cd2e3	\N	{}
13cda0be-a73b-4913-a1d3-e237eb79ca36	checklist-photos	anon/checklist-1776289011963-1.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:36:52.688467+00	2026-04-15 21:36:52.688467+00	2026-04-15 21:36:52.688467+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:36:52.686Z", "contentLength": 16312, "httpStatusCode": 200}	9e318990-aea1-4a47-8c05-a724e7b822b8	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
d206d569-2190-4f0f-99db-a63ff5a96e30	checklist-photos	anon/checklist-1776289011963-3.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:36:52.69147+00	2026-04-15 21:36:52.69147+00	2026-04-15 21:36:52.69147+00	{"eTag": "\\"e0d833315d013ff0f58791c5aa8d755c\\"", "size": 45784, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:36:52.687Z", "contentLength": 45784, "httpStatusCode": 200}	62cf1b90-4503-483c-9cf5-107e3edb3860	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
497e61cd-e481-4216-8785-fd33f57382d6	checklist-photos	anon/checklist-1776289011963-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:36:52.731468+00	2026-04-15 21:36:52.731468+00	2026-04-15 21:36:52.731468+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:36:52.728Z", "contentLength": 44512, "httpStatusCode": 200}	f3ccb66a-42d3-41cc-a388-d7e6b75a7771	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
887b044a-21d5-4767-b945-da1d507964b7	checklist-photos	anon/checklist-1776293397823-3.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:49:58.751712+00	2026-04-15 22:49:58.751712+00	2026-04-15 22:49:58.751712+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:49:58.746Z", "contentLength": 44512, "httpStatusCode": 200}	14a95688-5bdd-4b09-bb81-fae471d6eaa5	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
56c6148e-f3ea-4c04-b823-51d8560d6d7f	checklist-photos	anon/checklist-1776289011963-0.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:36:52.845357+00	2026-04-15 21:36:52.845357+00	2026-04-15 21:36:52.845357+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:36:52.833Z", "contentLength": 788666, "httpStatusCode": 200}	55beafcf-09f0-4bdf-ad20-b294d8eed021	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
d8028098-7179-4a07-9aa6-2d82e53eb2ce	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621217332-3.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 17:53:37.696461+00	2026-04-19 17:53:37.696461+00	2026-04-19 17:53:37.696461+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T17:53:37.694Z", "contentLength": 44512, "httpStatusCode": 200}	ff023422-6a61-436a-b558-d7bf8f215f0e	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
9536f488-7f73-447b-86b5-7d847d62dac8	checklist-photos	anon/checklist-1776289324861-2.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:42:05.655912+00	2026-04-15 21:42:05.655912+00	2026-04-15 21:42:05.655912+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:42:05.647Z", "contentLength": 16312, "httpStatusCode": 200}	f9c22f1c-c4fd-49b9-9faf-5d4b9ed81952	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
b00cd350-8034-43f7-9a2b-68ac002b4f26	checklist-photos	anon/checklist-1776293397823-2.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:49:58.792256+00	2026-04-15 22:49:58.792256+00	2026-04-15 22:49:58.792256+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:49:58.789Z", "contentLength": 87428, "httpStatusCode": 200}	9739016e-0700-4ad8-b6ab-fbe1f1dd0aaf	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
04a7d29c-0fd4-494c-aa1c-cf7aa5b1de44	checklist-photos	anon/checklist-1776289324861-3.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:42:05.726942+00	2026-04-15 21:42:05.726942+00	2026-04-15 21:42:05.726942+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:42:05.722Z", "contentLength": 44512, "httpStatusCode": 200}	4ef76f7a-ff0b-4b55-a422-76427bc4ea53	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
0934b4f3-f632-424d-941f-9f5dad512e52	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776294688764-0.PNG	\N	2026-04-15 23:11:29.647785+00	2026-04-15 23:11:29.647785+00	2026-04-15 23:11:29.647785+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:11:29.642Z", "contentLength": 87428, "httpStatusCode": 200}	e783303d-2f59-4ee3-b087-eea2c6867a09	\N	{}
cc0851b1-2387-4027-acaf-8ca200610171	checklist-photos	anon/checklist-1776289324861-1.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:42:05.817072+00	2026-04-15 21:42:05.817072+00	2026-04-15 21:42:05.817072+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:42:05.809Z", "contentLength": 148343, "httpStatusCode": 200}	488a0c9f-d0fc-4b20-abed-bd51ad334bf5	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
b69a354c-a096-462d-bba3-fe0f2ca474f4	checklist-photos	anon/checklist-1776289324861-0.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:42:05.951511+00	2026-04-15 21:42:05.951511+00	2026-04-15 21:42:05.951511+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:42:05.943Z", "contentLength": 788666, "httpStatusCode": 200}	02936bb0-6d98-45a7-a80f-05cef5c57d36	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
f9b933d1-550e-49df-96e7-e56b76bfbab0	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776294688765-1.PNG	\N	2026-04-15 23:11:29.698079+00	2026-04-15 23:11:29.698079+00	2026-04-15 23:11:29.698079+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:11:29.691Z", "contentLength": 87428, "httpStatusCode": 200}	b7cc5cce-086a-47a0-bb50-895c3e960830	\N	{}
7adf1cdc-d1de-465e-968f-8054c9f4a129	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776290183797-0.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:56:24.58831+00	2026-04-15 21:56:24.58831+00	2026-04-15 21:56:24.58831+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:56:24.584Z", "contentLength": 16312, "httpStatusCode": 200}	bd9d01dd-367a-4057-b7f9-0eb76fa31433	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
53c38881-7b87-4011-a1a8-173046681c99	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776290183798-1.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:56:24.628559+00	2026-04-15 21:56:24.628559+00	2026-04-15 21:56:24.628559+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:56:24.624Z", "contentLength": 44512, "httpStatusCode": 200}	4d2a0f5a-8d33-4ee3-a270-baf4556580b7	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
22e1566c-1213-468a-978c-930139badceb	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776290183798-3.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:56:24.64016+00	2026-04-15 21:56:24.64016+00	2026-04-15 21:56:24.64016+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:56:24.629Z", "contentLength": 16312, "httpStatusCode": 200}	44cd087b-8c2d-4a51-bbfa-5853ef3dbf7d	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
7b6a61a2-f8e4-4cb6-9fc6-23cf0c279da0	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776290183798-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:56:24.67508+00	2026-04-15 21:56:24.67508+00	2026-04-15 21:56:24.67508+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:56:24.668Z", "contentLength": 44512, "httpStatusCode": 200}	db3aa0d1-d60e-4448-9355-e7454f675ddd	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
0c7fb0d3-2614-4bb7-ba5f-4e82ae8949a2	checklist-photos	anon/checklist-1776290226961-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:57:07.688765+00	2026-04-15 21:57:07.688765+00	2026-04-15 21:57:07.688765+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:57:07.680Z", "contentLength": 44512, "httpStatusCode": 200}	a78c4ca9-3946-49df-9f17-f68b9e9977f2	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
419008c5-991f-41df-8be5-9521b7358bd4	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621217332-1.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 17:53:37.77367+00	2026-04-19 17:53:37.77367+00	2026-04-19 17:53:37.77367+00	{"eTag": "\\"11b34a7131cb5dafdc1dd1908391db1c\\"", "size": 171654, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T17:53:37.769Z", "contentLength": 171654, "httpStatusCode": 200}	29004cc1-151a-4851-b940-7127741e4a17	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
2655ae59-7b06-466d-b551-a70e1619e41a	checklist-photos	anon/checklist-1776290226961-3.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:57:07.733348+00	2026-04-15 21:57:07.733348+00	2026-04-15 21:57:07.733348+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:57:07.729Z", "contentLength": 44512, "httpStatusCode": 200}	cf713d7c-2fb0-446a-ad8e-33bd3eb7b6f9	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
55dec33a-29e9-4236-827d-19cd81fd1641	checklist-photos	anon/checklist-1776293628585-2.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:53:49.483114+00	2026-04-15 22:53:49.483114+00	2026-04-15 22:53:49.483114+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:53:49.475Z", "contentLength": 16312, "httpStatusCode": 200}	6997ac62-83ff-4a9b-ac45-844e4c428759	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
e530850b-3a92-4734-b5be-af3bccda995a	checklist-photos	anon/checklist-1776290226961-0.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:57:07.770278+00	2026-04-15 21:57:07.770278+00	2026-04-15 21:57:07.770278+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:57:07.767Z", "contentLength": 87428, "httpStatusCode": 200}	084269d0-bfa7-4224-86fd-09b7d135716d	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
45c4da72-1e51-46f4-a221-5311a4b9d293	delivery-photos	fuel_c3fc630c-17c5-41b3-90aa-3c455ff71123_1776691569820.jpg	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 13:26:10.207158+00	2026-04-20 13:26:10.207158+00	2026-04-20 13:26:10.207158+00	{"eTag": "\\"159582dfc6e9d473378a15488a5cab04\\"", "size": 177881, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T13:26:10.202Z", "contentLength": 177881, "httpStatusCode": 200}	e7b57b89-5727-462c-acd9-6e524eb88d8b	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
d486c66a-cc4b-4a08-9eb0-8a6acd7bec8d	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295249727-1.jpeg	\N	2026-04-15 23:20:50.544548+00	2026-04-15 23:20:50.544548+00	2026-04-15 23:20:50.544548+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:20:50.539Z", "contentLength": 16312, "httpStatusCode": 200}	57e0cd6c-affb-458d-9ab1-5cce3a3592d2	\N	{}
ff6869cf-eaf0-446b-82dd-f5ef5a99d18f	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295249727-3.jpeg	\N	2026-04-15 23:20:50.611428+00	2026-04-15 23:20:50.611428+00	2026-04-15 23:20:50.611428+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:20:50.607Z", "contentLength": 16312, "httpStatusCode": 200}	0be6accf-4e4b-4877-b258-a4f8b149509d	\N	{}
3dc85007-7acb-4993-aa71-e1d6796587c6	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295249726-0.PNG	\N	2026-04-15 23:20:50.644463+00	2026-04-15 23:20:50.644463+00	2026-04-15 23:20:50.644463+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:20:50.638Z", "contentLength": 87428, "httpStatusCode": 200}	10c0cd95-c72f-4a99-b6af-a1ea8dd4f840	\N	{}
1c30051f-2a4b-4988-be85-b9d723e0f3f9	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296294789-1.jpeg	\N	2026-04-15 23:38:15.729852+00	2026-04-15 23:38:15.729852+00	2026-04-15 23:38:15.729852+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:38:15.726Z", "contentLength": 16312, "httpStatusCode": 200}	a40e36c8-e48a-4e58-bd8c-3712434bfda5	\N	{}
852e8fe0-d0d7-4ecc-96fc-81852547fde0	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296294789-2.PNG	\N	2026-04-15 23:38:15.795834+00	2026-04-15 23:38:15.795834+00	2026-04-15 23:38:15.795834+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:38:15.788Z", "contentLength": 87428, "httpStatusCode": 200}	b6ee88a4-9024-4f16-a5a5-7b63bc0c7c33	\N	{}
324fa2e2-072a-4832-87fb-90fe0f4b1cf3	checklist-photos	anon/checklist-1776290226961-1.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 21:57:07.682756+00	2026-04-15 21:57:07.682756+00	2026-04-15 21:57:07.682756+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T21:57:07.676Z", "contentLength": 16312, "httpStatusCode": 200}	bb258723-121f-42b5-b669-e80b33d273c4	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
696dfad2-8fc7-48aa-813d-1c761d3bcbc0	checklist-photos	anon/checklist-1776293628585-1.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:53:49.486522+00	2026-04-15 22:53:49.486522+00	2026-04-15 22:53:49.486522+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:53:49.480Z", "contentLength": 87428, "httpStatusCode": 200}	bd8fba8d-e344-4c3f-a8cb-70b871ebbdaf	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
0249b8ec-9aad-4231-bce5-928d41c00cc3	checklist-photos	anon/checklist-1776290487125-3.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:01:27.925161+00	2026-04-15 22:01:27.925161+00	2026-04-15 22:01:27.925161+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:01:27.921Z", "contentLength": 44512, "httpStatusCode": 200}	bc996f74-a883-4c62-bbdd-c37b3d71cf5c	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
573da0c8-a19b-4a81-b03a-c31bb48837f4	delivery-photos	fuel_f043f0f1-93f3-45e7-8687-1a8c61fa3429_1776621307037.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 17:55:07.270544+00	2026-04-19 17:55:07.270544+00	2026-04-19 17:55:07.270544+00	{"eTag": "\\"dc5699f6ce1caaa4a2d4f5308c201588\\"", "size": 39194, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T17:55:07.268Z", "contentLength": 39194, "httpStatusCode": 200}	bf9dcbfa-5262-44b6-ab1f-40fff320a727	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
e95ed798-6a46-4f15-882b-4be8d39ff9b4	checklist-photos	anon/checklist-1776290487124-0.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:01:27.954803+00	2026-04-15 22:01:27.954803+00	2026-04-15 22:01:27.954803+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:01:27.949Z", "contentLength": 87428, "httpStatusCode": 200}	56a50b41-6da2-4c3f-b0a5-5942448648a3	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
ac704183-499b-4627-9fa7-ce224e3cf6f6	checklist-photos	anon/checklist-1776290487125-1.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:01:27.989137+00	2026-04-15 22:01:27.989137+00	2026-04-15 22:01:27.989137+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:01:27.986Z", "contentLength": 44512, "httpStatusCode": 200}	1d02be38-498c-4b93-8e9a-da7084414171	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
9858ed8a-65fd-446e-8fe2-3437260681bb	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295249727-2.PNG	\N	2026-04-15 23:20:50.668137+00	2026-04-15 23:20:50.668137+00	2026-04-15 23:20:50.668137+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:20:50.664Z", "contentLength": 87428, "httpStatusCode": 200}	53b85b0a-7001-4315-aead-72169295bf8d	\N	{}
87ae091d-0029-42e4-bb93-3668fb41163f	checklist-photos	anon/checklist-1776290487125-2.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:01:28.050417+00	2026-04-15 22:01:28.050417+00	2026-04-15 22:01:28.050417+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:01:28.045Z", "contentLength": 87428, "httpStatusCode": 200}	163a2989-c61e-4a1e-8288-714b370a6a6c	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
a06bf590-6d1a-4e05-a12c-b5f4a69d5192	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776297271820-0.jpeg	\N	2026-04-15 23:54:32.722409+00	2026-04-15 23:54:32.722409+00	2026-04-15 23:54:32.722409+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:54:32.718Z", "contentLength": 16312, "httpStatusCode": 200}	0194b3cf-9948-4310-a697-8eeeee9e2353	\N	{}
3203ef83-2210-41b2-83d7-e47b39927583	checklist-photos	anon/checklist-1776290942207-0.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:09:03.247326+00	2026-04-15 22:09:03.247326+00	2026-04-15 22:09:03.247326+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:09:03.232Z", "contentLength": 44512, "httpStatusCode": 200}	fd9dbfde-0def-495d-bf5d-274399f959fb	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
15c53b24-3df2-4dda-a59d-7a67c04bdd3a	checklist-photos	anon/checklist-1776290942208-3.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:09:03.270573+00	2026-04-15 22:09:03.270573+00	2026-04-15 22:09:03.270573+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:09:03.238Z", "contentLength": 87428, "httpStatusCode": 200}	3d347c39-6b53-41a4-9b7f-511cb5453e87	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
ea57b451-8f11-4f96-b163-fb2eca01b96b	checklist-photos	anon/checklist-1776290942208-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:09:03.315655+00	2026-04-15 22:09:03.315655+00	2026-04-15 22:09:03.315655+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:09:03.288Z", "contentLength": 44512, "httpStatusCode": 200}	f1229a40-5691-44c5-b47f-519115635953	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
13befe9e-6c73-4f4e-90f9-531fb56f95a4	checklist-photos	anon/checklist-1776290942208-1.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:09:03.32554+00	2026-04-15 22:09:03.32554+00	2026-04-15 22:09:03.32554+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:09:03.299Z", "contentLength": 87428, "httpStatusCode": 200}	80210b90-e886-4ebd-96c7-abbbafc833c1	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
cf9a836e-b0ae-48bb-8c27-8ad76cde6092	checklist-photos	anon/checklist-1776291517277-1.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:18:38.127456+00	2026-04-15 22:18:38.127456+00	2026-04-15 22:18:38.127456+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:18:38.123Z", "contentLength": 44512, "httpStatusCode": 200}	103b560b-9222-4ac1-8e32-f6a50a1a6bd9	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
265f4f3c-6a48-4bb6-9edd-a7c08547d6aa	checklist-photos	anon/checklist-1776293628585-0.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:53:49.497472+00	2026-04-15 22:53:49.497472+00	2026-04-15 22:53:49.497472+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:53:49.487Z", "contentLength": 44512, "httpStatusCode": 200}	090c65ea-49d3-4ada-9224-3fb9638d789f	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
8c3e5a52-1ddc-4f84-b3f0-4eb1afed4e14	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295347142-1.jpeg	\N	2026-04-15 23:22:28.05304+00	2026-04-15 23:22:28.05304+00	2026-04-15 23:22:28.05304+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:22:28.049Z", "contentLength": 16312, "httpStatusCode": 200}	b7c75e1e-7df4-4a33-b04b-244b2755d540	\N	{}
35ab5159-ea0d-4f63-9a4e-e6e20c8fe04c	checklist-photos	anon/checklist-1776291517277-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:18:38.173276+00	2026-04-15 22:18:38.173276+00	2026-04-15 22:18:38.173276+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:18:38.163Z", "contentLength": 44512, "httpStatusCode": 200}	41ddc8a0-3cd3-4fa6-aa3a-efda5aebc7c5	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
9d54cbd2-5a55-4a8f-8b40-31a15733bd54	checklist-photos	anon/checklist-1776291517277-3.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:18:38.184929+00	2026-04-15 22:18:38.184929+00	2026-04-15 22:18:38.184929+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:18:38.176Z", "contentLength": 87428, "httpStatusCode": 200}	74cac969-4f8a-4dc4-8105-f27e7a5cd69b	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
d23891e1-ca26-4b18-90c4-1f390d9c51cf	checklist-photos	anon/checklist-1776291517271-0.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:18:38.193324+00	2026-04-15 22:18:38.193324+00	2026-04-15 22:18:38.193324+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:18:38.183Z", "contentLength": 87428, "httpStatusCode": 200}	2aec5953-aca4-4296-90ec-2133eff33cbb	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
7252df70-8ce2-4ea2-ba26-b8b50debee34	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621912764-2.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 18:05:13.100708+00	2026-04-19 18:05:13.100708+00	2026-04-19 18:05:13.100708+00	{"eTag": "\\"dc5699f6ce1caaa4a2d4f5308c201588\\"", "size": 39194, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T18:05:13.098Z", "contentLength": 39194, "httpStatusCode": 200}	0f74c124-d792-48fd-a437-26799081e098	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
be33fde9-74c6-4445-b0a6-6b117d88efa0	vehicle-photos	1776291625367_bongo.jpeg	\N	2026-04-15 22:20:26.404283+00	2026-04-15 22:20:26.404283+00	2026-04-15 22:20:26.404283+00	{"eTag": "\\"8f9f7128c7cc0158e35717c955ef779f\\"", "size": 185482, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:20:26.401Z", "contentLength": 185482, "httpStatusCode": 200}	201434fa-4cff-4e61-98f8-455367b21ea2	\N	{}
419742ca-d90b-4cf9-ad36-38a5e8733233	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295347142-2.PNG	\N	2026-04-15 23:22:28.118139+00	2026-04-15 23:22:28.118139+00	2026-04-15 23:22:28.118139+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:22:28.112Z", "contentLength": 87428, "httpStatusCode": 200}	95123d73-c41d-45ac-90e8-92546dc3f987	\N	{}
e05abae3-7b0f-4804-b217-4876adf083fb	checklist-photos	anon/checklist-1776292253819-0.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:30:54.590003+00	2026-04-15 22:30:54.590003+00	2026-04-15 22:30:54.590003+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:30:54.587Z", "contentLength": 44512, "httpStatusCode": 200}	b0c6778d-891e-4eb7-8f9c-b220f63883cb	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
bbd86d0c-3bf8-481c-ba6f-6a2b6ec39e56	checklist-photos	anon/checklist-1776292253819-1.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:30:54.59033+00	2026-04-15 22:30:54.59033+00	2026-04-15 22:30:54.59033+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:30:54.588Z", "contentLength": 16312, "httpStatusCode": 200}	a7e24b5e-bf72-4d88-8e0a-749e333e3afb	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
630b2648-b991-4b9d-a000-e28f28456ec7	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296294789-3.jpeg	\N	2026-04-15 23:38:15.744841+00	2026-04-15 23:38:15.744841+00	2026-04-15 23:38:15.744841+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:38:15.729Z", "contentLength": 16312, "httpStatusCode": 200}	9a192fb9-cdab-4756-823e-ef745f938fbc	\N	{}
0d3091ab-22a8-42b3-848d-2d0581910487	checklist-photos	anon/checklist-1776292253819-3.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:30:54.6214+00	2026-04-15 22:30:54.6214+00	2026-04-15 22:30:54.6214+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:30:54.620Z", "contentLength": 44512, "httpStatusCode": 200}	8d83640a-b3a8-4536-899d-b2dc7a331f4e	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
3119ee35-0e2f-4cdd-a3c5-dd9e1ee7ee4c	checklist-photos	anon/checklist-1776292253819-2.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:30:54.668797+00	2026-04-15 22:30:54.668797+00	2026-04-15 22:30:54.668797+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:30:54.666Z", "contentLength": 87428, "httpStatusCode": 200}	5695302b-5f11-4b07-aa6f-896477c634d6	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
9e13d632-e156-433e-8ca3-35519d1dda44	checklist-photos	anon/checklist-1776292725987-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:38:46.870255+00	2026-04-15 22:38:46.870255+00	2026-04-15 22:38:46.870255+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:38:46.865Z", "contentLength": 44512, "httpStatusCode": 200}	34a45266-a133-487c-bc56-62319bb9bf7f	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
d4f3eb6e-6b85-42e3-9d26-7cde30aa2399	checklist-photos	anon/checklist-1776293628585-3.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:53:49.518235+00	2026-04-15 22:53:49.518235+00	2026-04-15 22:53:49.518235+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:53:49.512Z", "contentLength": 44512, "httpStatusCode": 200}	89028041-a8b2-43f7-a4ad-242c9575066f	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
af557f59-7051-4a0c-bbe8-14e36b45cce1	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295347142-3.jpeg	\N	2026-04-15 23:22:28.066624+00	2026-04-15 23:22:28.066624+00	2026-04-15 23:22:28.066624+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:22:28.057Z", "contentLength": 16312, "httpStatusCode": 200}	ceb73e84-180b-4a5f-bccc-af029b40e532	\N	{}
59d9f4e1-852b-462c-b56f-369f3183d189	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295347142-0.PNG	\N	2026-04-15 23:22:28.107936+00	2026-04-15 23:22:28.107936+00	2026-04-15 23:22:28.107936+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:22:28.100Z", "contentLength": 87428, "httpStatusCode": 200}	790cc05b-a1ab-4c1e-be78-4c8040f97eff	\N	{}
9c4cb115-2e52-47e9-bf7d-3fcf9fc21342	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296294789-0.PNG	\N	2026-04-15 23:38:15.792718+00	2026-04-15 23:38:15.792718+00	2026-04-15 23:38:15.792718+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:38:15.786Z", "contentLength": 87428, "httpStatusCode": 200}	991049a2-a42b-403d-85fb-245c011e6dd0	\N	{}
9c4ee9f5-d1cf-4f08-a55e-9cd642c547b2	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776297271821-1.jpg	\N	2026-04-15 23:54:32.721467+00	2026-04-15 23:54:32.721467+00	2026-04-15 23:54:32.721467+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:54:32.717Z", "contentLength": 44512, "httpStatusCode": 200}	e2af0daa-eb78-41d1-b7bb-af2be6b49e67	\N	{}
f2cc4ffe-d3b6-4473-b22c-7875f2fe06a6	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621912764-3.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 18:05:13.099911+00	2026-04-19 18:05:13.099911+00	2026-04-19 18:05:13.099911+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T18:05:13.098Z", "contentLength": 16312, "httpStatusCode": 200}	934b318b-797f-41a9-a587-6013fec2ae3b	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
0e281e38-a639-4f8b-a8fa-0a6c02cfd6d3	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776305419965-2.jpeg	\N	2026-04-16 02:10:20.953783+00	2026-04-16 02:10:20.953783+00	2026-04-16 02:10:20.953783+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T02:10:20.949Z", "contentLength": 16312, "httpStatusCode": 200}	47fe3411-afc4-498a-9930-673ec8dc787a	\N	{}
17b776b1-2d70-4ce7-b047-30012f50ea59	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776305419965-1.jpeg	\N	2026-04-16 02:10:20.958567+00	2026-04-16 02:10:20.958567+00	2026-04-16 02:10:20.958567+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T02:10:20.955Z", "contentLength": 16312, "httpStatusCode": 200}	30cdf902-986a-4dc3-9fd8-f7d6f24b64c1	\N	{}
5de945b5-172c-4f56-b5ab-aadcced25fa5	delivery-photos	delivery_2286bd50-38eb-4e83-be0c-c2187f127f9a_1776692372679.jpg	\N	2026-04-20 13:39:33.065658+00	2026-04-20 13:39:33.065658+00	2026-04-20 13:39:33.065658+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T13:39:33.063Z", "contentLength": 44512, "httpStatusCode": 200}	02814591-3e29-46b4-93ce-ae6d20c39615	\N	{}
077254d2-384e-4f45-9353-177882d74929	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776305419963-0.PNG	\N	2026-04-16 02:10:21.024345+00	2026-04-16 02:10:21.024345+00	2026-04-16 02:10:21.024345+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T02:10:21.021Z", "contentLength": 87428, "httpStatusCode": 200}	009e8beb-e1cf-424b-831e-7b7460c8953c	\N	{}
7f58cb95-f6f7-4de6-8b3b-77aabf144274	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776305419965-3.PNG	\N	2026-04-16 02:10:21.062355+00	2026-04-16 02:10:21.062355+00	2026-04-16 02:10:21.062355+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T02:10:21.059Z", "contentLength": 87428, "httpStatusCode": 200}	ac5635ab-a60a-40ac-b6da-e788c3f055ad	\N	{}
3b395edd-1a4c-497b-9465-79b091edebdc	pedidos	pedidos/pedido_e5bcca1f-bec5-43ca-8584-bb718dde4183.pdf	\N	2026-04-16 10:26:37.026253+00	2026-04-16 10:26:37.026253+00	2026-04-16 10:26:37.026253+00	{"eTag": "\\"3f229adfffacbc4c0b033c79ce4b1d89\\"", "size": 55674, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T10:26:36.988Z", "contentLength": 55674, "httpStatusCode": 200}	9117f3d0-7240-4b16-8ca6-91e80a7098f7	\N	{}
a32917bf-dc77-4051-a423-c95e1ab68b80	vehicle-photos	1776337341896_IZZ.jpeg	\N	2026-04-16 11:02:22.87217+00	2026-04-16 11:02:22.87217+00	2026-04-16 11:02:22.87217+00	{"eTag": "\\"3549768232effffed900e34ba313319e\\"", "size": 118320, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T11:02:22.868Z", "contentLength": 118320, "httpStatusCode": 200}	feea47f3-9ddd-4acf-9808-f0f5138551f3	\N	{}
9eddf8fa-caca-4440-bcc8-1550f8d67897	checklist-photos	anon/checklist-1776292725987-3.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:38:46.875098+00	2026-04-15 22:38:46.875098+00	2026-04-15 22:38:46.875098+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:38:46.871Z", "contentLength": 16312, "httpStatusCode": 200}	47c2b41b-19fa-4c37-a196-4e51a5b85e40	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
971bd950-bdf1-4141-90a0-e02c756c1ba5	checklist-photos	anon/checklist-1776293807766-0.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:56:48.612306+00	2026-04-15 22:56:48.612306+00	2026-04-15 22:56:48.612306+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:56:48.609Z", "contentLength": 16312, "httpStatusCode": 200}	ff3106b7-0a4e-44c5-824c-7be58faa28b4	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
3b8b32f1-40c1-4bc0-bf99-7e45ab16093c	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621912763-0.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 18:05:13.143437+00	2026-04-19 18:05:13.143437+00	2026-04-19 18:05:13.143437+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T18:05:13.141Z", "contentLength": 148343, "httpStatusCode": 200}	94c59ec3-3b22-4444-bc94-708d85247c22	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
489988e5-74af-47b4-87c6-2e9f4c91cd1e	checklist-photos	anon/checklist-1776293807767-1.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:56:48.686715+00	2026-04-15 22:56:48.686715+00	2026-04-15 22:56:48.686715+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:56:48.681Z", "contentLength": 44512, "httpStatusCode": 200}	71fcb1ee-7b61-4446-bf2e-f9d575697c0b	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
cfc6b404-5e62-4627-bc52-7952750ce667	checklist-photos	anon/checklist-1776293807767-3.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:56:48.709059+00	2026-04-15 22:56:48.709059+00	2026-04-15 22:56:48.709059+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:56:48.704Z", "contentLength": 87428, "httpStatusCode": 200}	f15f97f8-d19b-4906-a81d-db10d16ed64a	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
64d5c8a5-0400-4900-80dd-e87c1b0dddf8	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776621912764-1.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 18:05:13.345337+00	2026-04-19 18:05:13.345337+00	2026-04-19 18:05:13.345337+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T18:05:13.341Z", "contentLength": 788666, "httpStatusCode": 200}	b6508b9e-9e5c-4449-a3c2-41b6a69c305b	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
5281774d-53c1-498f-bd47-ad367703135a	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295412772-1.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 23:23:33.577457+00	2026-04-15 23:23:33.577457+00	2026-04-15 23:23:33.577457+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:23:33.575Z", "contentLength": 16312, "httpStatusCode": 200}	639448b3-9f53-4c30-8eb1-e3a7151cf158	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
f2289596-cb8e-4e0d-a3a4-39a90a086e5a	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295412765-0.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 23:23:33.613629+00	2026-04-15 23:23:33.613629+00	2026-04-15 23:23:33.613629+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:23:33.611Z", "contentLength": 87428, "httpStatusCode": 200}	9a0efa5c-ba05-48d9-8c36-432aa08aa086	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
75e5e2af-74c6-449a-8bb8-75921affad5c	delivery-photos	delivery_2286bd50-38eb-4e83-be0c-c2187f127f9a_1776692380421.jpg	\N	2026-04-20 13:39:40.688123+00	2026-04-20 13:39:40.688123+00	2026-04-20 13:39:40.688123+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T13:39:40.686Z", "contentLength": 44512, "httpStatusCode": 200}	16add5c0-a1aa-4c58-9d89-a05cf2eda033	\N	{}
0be1b34c-10b4-4996-9201-85144c3e7fd2	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295412772-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 23:23:33.632923+00	2026-04-15 23:23:33.632923+00	2026-04-15 23:23:33.632923+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:23:33.631Z", "contentLength": 44512, "httpStatusCode": 200}	d13943ca-f86c-439f-9a3c-e079aca1b9a5	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
96fc8b0d-1672-4534-ad55-35760017a0c8	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776295412772-3.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 23:23:33.697266+00	2026-04-15 23:23:33.697266+00	2026-04-15 23:23:33.697266+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:23:33.694Z", "contentLength": 87428, "httpStatusCode": 200}	a521cadd-b743-49e8-a8dd-e6f20c8ffffc	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
8eaf5f49-534f-4fd2-bbde-43f30dcd4197	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296350470-0.jpeg	\N	2026-04-15 23:39:11.289587+00	2026-04-15 23:39:11.289587+00	2026-04-15 23:39:11.289587+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:39:11.286Z", "contentLength": 16312, "httpStatusCode": 200}	cc2c20a8-1f49-4532-948e-deef2430fc72	\N	{}
5cd0ccbb-93e2-4f7f-8996-f6452de84ad6	checklist-photos	anon/checklist-1776292725986-0.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:38:46.87546+00	2026-04-15 22:38:46.87546+00	2026-04-15 22:38:46.87546+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:38:46.870Z", "contentLength": 87428, "httpStatusCode": 200}	5afa053b-33ba-4f71-ae9d-d3476064fbfd	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
f7163a98-6298-47ee-b043-6252bfd716a4	checklist-photos	anon/checklist-1776292725987-1.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-15 22:38:46.909946+00	2026-04-15 22:38:46.909946+00	2026-04-15 22:38:46.909946+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T22:38:46.908Z", "contentLength": 44512, "httpStatusCode": 200}	b38a3e33-748c-4086-9cac-87c9ce8226ae	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
401b4ca3-5f4a-446f-b4d4-0bf44e17d9a1	checklist-photos	22da979a-4e00-48e8-8e0e-6654f8c590bc/checklist-1776629510005-1.jpeg	\N	2026-04-19 20:11:50.431544+00	2026-04-19 20:11:50.431544+00	2026-04-19 20:11:50.431544+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T20:11:50.427Z", "contentLength": 16312, "httpStatusCode": 200}	cfd18ccd-4a9b-4edb-8182-bb4068e1a81e	\N	{}
7aae3a12-e57e-4072-a46d-729b850a6329	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296134035-1.jpeg	\N	2026-04-15 23:35:34.856727+00	2026-04-15 23:35:34.856727+00	2026-04-15 23:35:34.856727+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:35:34.854Z", "contentLength": 16312, "httpStatusCode": 200}	f1f8f900-602e-47ac-b7cd-ff9cfdd17595	\N	{}
f681d134-2dc4-4874-97bc-c3a2945bf037	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296134035-3.jpeg	\N	2026-04-15 23:35:34.915516+00	2026-04-15 23:35:34.915516+00	2026-04-15 23:35:34.915516+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:35:34.911Z", "contentLength": 16312, "httpStatusCode": 200}	df709f97-6068-4af5-93d6-c180d156e6cf	\N	{}
0e3f22b2-c731-4b9d-b701-fb00e2187bd0	checklist-photos	22da979a-4e00-48e8-8e0e-6654f8c590bc/checklist-1776629510005-3.PNG	\N	2026-04-19 20:11:50.512764+00	2026-04-19 20:11:50.512764+00	2026-04-19 20:11:50.512764+00	{"eTag": "\\"bf1e6b261cf63249fe4998797e081a38\\"", "size": 136336, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T20:11:50.509Z", "contentLength": 136336, "httpStatusCode": 200}	621098f7-e516-410b-92fc-2b039d8f2768	\N	{}
619258dd-8c6b-4ae8-a241-d46a3b849fd2	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296134032-0.PNG	\N	2026-04-15 23:35:34.958216+00	2026-04-15 23:35:34.958216+00	2026-04-15 23:35:34.958216+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:35:34.954Z", "contentLength": 87428, "httpStatusCode": 200}	24798d2b-f1cb-4ffc-ac51-a508a2e9033e	\N	{}
6b190ec5-54be-4845-8182-588542a57f97	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296350471-1.PNG	\N	2026-04-15 23:39:11.335602+00	2026-04-15 23:39:11.335602+00	2026-04-15 23:39:11.335602+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:39:11.332Z", "contentLength": 87428, "httpStatusCode": 200}	d526b674-cb18-4470-ba1b-f9c20aba845e	\N	{}
52e20097-ce25-444f-b4b6-45fbd36f7751	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296350471-3.jpeg	\N	2026-04-15 23:39:11.366323+00	2026-04-15 23:39:11.366323+00	2026-04-15 23:39:11.366323+00	{"eTag": "\\"e0d833315d013ff0f58791c5aa8d755c\\"", "size": 45784, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:39:11.363Z", "contentLength": 45784, "httpStatusCode": 200}	f805e63f-76fb-4a35-ad3d-99d2fd54bcb5	\N	{}
8b62d7c9-7199-41bc-8d73-ebbb725b4582	checklist-photos	22da979a-4e00-48e8-8e0e-6654f8c590bc/checklist-1776629510005-2.jpeg	\N	2026-04-19 20:11:50.550496+00	2026-04-19 20:11:50.550496+00	2026-04-19 20:11:50.550496+00	{"eTag": "\\"159582dfc6e9d473378a15488a5cab04\\"", "size": 177881, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T20:11:50.547Z", "contentLength": 177881, "httpStatusCode": 200}	d83908b6-cd67-4ec8-bb9a-88de2fbb43a2	\N	{}
5a884fb0-8f03-4fbc-a193-696f8f15e68b	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776296350471-2.PNG	\N	2026-04-15 23:39:11.835746+00	2026-04-15 23:39:11.835746+00	2026-04-15 23:39:11.835746+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:39:11.829Z", "contentLength": 788666, "httpStatusCode": 200}	cf43a52d-5a75-4570-97e5-587833a80eaf	\N	{}
fb3d98f4-6f5c-448f-9f9f-4bb4497c0137	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776297271821-2.PNG	\N	2026-04-15 23:54:32.796081+00	2026-04-15 23:54:32.796081+00	2026-04-15 23:54:32.796081+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:54:32.788Z", "contentLength": 87428, "httpStatusCode": 200}	b1827931-59dd-4329-9c31-957540141328	\N	{}
e27833e3-a290-4718-91e3-2e6996f1a8ee	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776297271821-3.PNG	\N	2026-04-15 23:54:32.852816+00	2026-04-15 23:54:32.852816+00	2026-04-15 23:54:32.852816+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-15T23:54:32.849Z", "contentLength": 87428, "httpStatusCode": 200}	6772cc21-1278-466e-83bc-0056c238b825	\N	{}
c942def5-0605-47be-b859-f873e6cb6d07	vehicle-photos	1776337451796_IZZ.jpeg	\N	2026-04-16 11:04:12.728298+00	2026-04-16 11:04:12.728298+00	2026-04-16 11:04:12.728298+00	{"eTag": "\\"3549768232effffed900e34ba313319e\\"", "size": 118320, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T11:04:12.724Z", "contentLength": 118320, "httpStatusCode": 200}	66684870-b4ad-4e94-b30a-ae3d94d7d76c	\N	{}
e314015a-d1e8-4771-bdb7-1efc16a19ea7	checklist-photos	22da979a-4e00-48e8-8e0e-6654f8c590bc/checklist-1776629510004-0.PNG	\N	2026-04-19 20:11:50.697205+00	2026-04-19 20:11:50.697205+00	2026-04-19 20:11:50.697205+00	{"eTag": "\\"74c239ae6608f675f8de17a9263e183c\\"", "size": 788666, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T20:11:50.689Z", "contentLength": 788666, "httpStatusCode": 200}	eeada9a5-996c-480b-b4cc-6c4af6d235de	\N	{}
01cda038-ca6b-40f3-ac23-bafd965ddbfe	checklist-photos	d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776693238010-3.jpeg	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 13:53:58.390288+00	2026-04-20 13:53:58.390288+00	2026-04-20 13:53:58.390288+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T13:53:58.385Z", "contentLength": 16312, "httpStatusCode": 200}	d2b26b65-3e47-4969-96de-b9bad29b798e	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
3af1820c-cbb6-4636-a9fa-971f403f7a5e	checklist-photos	d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776693238008-0.PNG	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 13:53:58.715317+00	2026-04-20 13:53:58.715317+00	2026-04-20 13:53:58.715317+00	{"eTag": "\\"451492942289971894444fbb83a50d2d\\"", "size": 394109, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T13:53:58.708Z", "contentLength": 394109, "httpStatusCode": 200}	157e32cc-31f1-464f-b6ae-210876e9ba1e	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
2c93c90a-15a9-49ab-8bd7-08e80b09438c	checklist-photos	d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776693238010-1.PNG	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 13:53:58.982533+00	2026-04-20 13:53:58.982533+00	2026-04-20 13:53:58.982533+00	{"eTag": "\\"f5e18adbab33cc52fb2d296bfeee4bea\\"", "size": 901034, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T13:53:58.971Z", "contentLength": 901034, "httpStatusCode": 200}	df239f0b-bd74-4ac2-af88-9f92cfe8b24c	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
b06a980a-16fa-4f9e-ba7a-6eac2a82decd	delivery-photos	delivery_618ccf26-5910-4edd-97cf-c2013aa86d2f_1776639275091.jpg	dc1dd703-112a-4ac7-b947-2c81562896b7	2026-04-19 22:54:35.676349+00	2026-04-19 22:54:35.676349+00	2026-04-19 22:54:35.676349+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T22:54:35.674Z", "contentLength": 87428, "httpStatusCode": 200}	de78944d-2159-4253-b54b-b0c9590eb6c1	dc1dd703-112a-4ac7-b947-2c81562896b7	{}
974994ed-7e5c-4f41-8439-1cf5e9182891	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776341794260-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 12:16:35.201736+00	2026-04-16 12:16:35.201736+00	2026-04-16 12:16:35.201736+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T12:16:35.195Z", "contentLength": 44512, "httpStatusCode": 200}	2879d46e-5ed3-4261-84a4-66ceac1b6471	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
69f4b298-d84e-4b13-b76d-e6f6c10a200a	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776341794260-1.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 12:16:35.221713+00	2026-04-16 12:16:35.221713+00	2026-04-16 12:16:35.221713+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T12:16:35.199Z", "contentLength": 87428, "httpStatusCode": 200}	f7a3896a-aa8f-40dc-bf14-f28fd6c0bb06	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
6d159572-77b3-4588-a54e-7cc672c580f6	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776341794260-3.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 12:16:35.262079+00	2026-04-16 12:16:35.262079+00	2026-04-16 12:16:35.262079+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T12:16:35.224Z", "contentLength": 44512, "httpStatusCode": 200}	cec5d590-a445-4194-84a2-408245566def	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
202aa43c-9790-45c8-8369-dee17e3b723f	checklist-photos	d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776693238010-2.jpg	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 13:53:58.389158+00	2026-04-20 13:53:58.389158+00	2026-04-20 13:53:58.389158+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T13:53:58.385Z", "contentLength": 44512, "httpStatusCode": 200}	d2e9867f-6691-4022-8742-004990d94438	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
a2feb53e-c5fa-4452-9ec7-3a93c45952f6	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776341794259-0.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 12:16:35.201868+00	2026-04-16 12:16:35.201868+00	2026-04-16 12:16:35.201868+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T12:16:35.196Z", "contentLength": 44512, "httpStatusCode": 200}	0679e455-7a04-4f1e-b4b3-a9ebfa75c8fe	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
cf98e406-a2de-472d-8401-da610469bf3b	delivery-photos	delivery_25273826-dcfd-4f98-93d5-07ab29e6a9f5_1776641687245.jpg	dc1dd703-112a-4ac7-b947-2c81562896b7	2026-04-19 23:34:48.147142+00	2026-04-19 23:34:48.147142+00	2026-04-19 23:34:48.147142+00	{"eTag": "\\"1430f34178700cafb50cee71288d67fa\\"", "size": 1027465, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T23:34:48.140Z", "contentLength": 1027465, "httpStatusCode": 200}	daa58a27-5a5f-4189-9bee-f733da652d57	dc1dd703-112a-4ac7-b947-2c81562896b7	{}
b471b3d5-acfc-4e23-9081-db3d9a3c3536	delivery-photos	delivery_60631049-54e3-4f6b-a129-b26abd0a9e2d_1776720261949.jpg	dc1dd703-112a-4ac7-b947-2c81562896b7	2026-04-20 21:24:23.705176+00	2026-04-20 21:24:23.705176+00	2026-04-20 21:24:23.705176+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T21:24:23.700Z", "contentLength": 87428, "httpStatusCode": 200}	08d91dce-c05a-45a9-b207-b0dd9579c49a	dc1dd703-112a-4ac7-b947-2c81562896b7	{}
4337ea51-4ac5-4875-b0bf-5d7d8ba90dad	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776373832819-1.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 21:10:34.226816+00	2026-04-16 21:10:34.226816+00	2026-04-16 21:10:34.226816+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T21:10:34.219Z", "contentLength": 87428, "httpStatusCode": 200}	75c67ea1-5ecc-4e0a-83fd-4a2059a70c69	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
8e7394a5-7fd6-421d-8d06-f9c64192211c	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776373832819-0.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 21:10:34.227664+00	2026-04-16 21:10:34.227664+00	2026-04-16 21:10:34.227664+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T21:10:34.219Z", "contentLength": 87428, "httpStatusCode": 200}	61a25b55-15d3-4449-935d-c0678f4f745c	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
9da2f35c-53c9-46e9-805c-690edba597b3	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776373832819-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 21:10:34.232171+00	2026-04-16 21:10:34.232171+00	2026-04-16 21:10:34.232171+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T21:10:34.222Z", "contentLength": 44512, "httpStatusCode": 200}	fb4548e0-801f-4fea-b056-0f13bdbb2cbd	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
346f6e4d-fc4f-4441-a051-4685cd033350	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776373832819-3.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 21:10:34.269711+00	2026-04-16 21:10:34.269711+00	2026-04-16 21:10:34.269711+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T21:10:34.232Z", "contentLength": 87428, "httpStatusCode": 200}	9d47d5c1-00bd-4c66-bdf8-e6876c62f134	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
c94ba06d-af10-4843-9891-2b028766a283	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776374473605-0.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 21:21:15.022763+00	2026-04-16 21:21:15.022763+00	2026-04-16 21:21:15.022763+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T21:21:15.013Z", "contentLength": 16312, "httpStatusCode": 200}	b54bcbb6-822f-41bb-aee7-8bc63f709a8c	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
ce205cc4-d2f6-4e2b-a5d6-2c4e9e27d3b6	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776374473606-2.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 21:21:15.052076+00	2026-04-16 21:21:15.052076+00	2026-04-16 21:21:15.052076+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T21:21:15.049Z", "contentLength": 44512, "httpStatusCode": 200}	13707458-f54f-4115-ae90-5eaf79e80572	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
14ad98a7-13a5-420d-a3b2-f941a3fcfbe8	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776374473606-1.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 21:21:15.114911+00	2026-04-16 21:21:15.114911+00	2026-04-16 21:21:15.114911+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T21:21:15.109Z", "contentLength": 87428, "httpStatusCode": 200}	f4107f19-bc60-4133-bd6d-ddbbd585e76f	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
1583f75a-b3c1-45e6-ac1a-8384c644c556	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776374473606-3.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-16 21:21:15.11551+00	2026-04-16 21:21:15.11551+00	2026-04-16 21:21:15.11551+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-16T21:21:15.109Z", "contentLength": 87428, "httpStatusCode": 200}	ac4840ac-d529-4e41-b2f3-15e8eecf722b	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
3e132b04-1ed8-4060-8c88-7ebda3937fe0	pedidos	pedidos/pedido_f9e20155-b792-41b9-9a8c-fbdf577619d4.pdf	\N	2026-04-18 19:20:37.472228+00	2026-04-18 19:20:37.472228+00	2026-04-18 19:20:37.472228+00	{"eTag": "\\"81ff84b0d417bdeaa9c4091565b868f3\\"", "size": 219271, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-04-18T19:20:37.463Z", "contentLength": 219271, "httpStatusCode": 200}	cd655dde-9db0-48f0-b804-11561586571f	\N	{}
420e5992-8c59-4cb8-93ed-2c9ac29d2f61	checklist-photos	d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776680263572-1.jpeg	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 10:17:45.013563+00	2026-04-20 10:17:45.013563+00	2026-04-20 10:17:45.013563+00	{"eTag": "\\"4fcbf90d2166b4b199c49a1b02395ccb\\"", "size": 60304, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T10:17:45.007Z", "contentLength": 60304, "httpStatusCode": 200}	895dff1e-91fe-4ac3-944e-9ef3a474ed04	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
b33625af-89ca-4c07-9744-22f7b1c8e63a	delivery-photos	delivery_f9e20155-b792-41b9-9a8c-fbdf577619d4_1776557594670.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 00:13:15.580997+00	2026-04-19 00:13:15.580997+00	2026-04-19 00:13:15.580997+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T00:13:15.575Z", "contentLength": 148343, "httpStatusCode": 200}	fcc6f0a0-fb2a-4be1-b584-2092071d0984	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
4c80b7c9-6eac-4c21-9b04-64dc4fe76e5d	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776558859089-3.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 00:34:20.023002+00	2026-04-19 00:34:20.023002+00	2026-04-19 00:34:20.023002+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T00:34:20.017Z", "contentLength": 44512, "httpStatusCode": 200}	67f8c30e-32ee-4f82-8bdc-a5cd63f2c140	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
e77e43a2-807d-4bb6-b3df-6b6160e04d06	checklist-photos	d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776680263572-2.jpeg	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 10:17:45.222396+00	2026-04-20 10:17:45.222396+00	2026-04-20 10:17:45.222396+00	{"eTag": "\\"159582dfc6e9d473378a15488a5cab04\\"", "size": 177881, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T10:17:45.217Z", "contentLength": 177881, "httpStatusCode": 200}	2f30d392-2778-4f05-9f70-4a2fea8dfe68	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
9bba7c15-aef0-4b4c-b73f-76f50f486218	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776558859089-2.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 00:34:20.082117+00	2026-04-19 00:34:20.082117+00	2026-04-19 00:34:20.082117+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T00:34:20.074Z", "contentLength": 87428, "httpStatusCode": 200}	d2fc4c47-2065-44c0-93be-a4d34771b97c	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
4baa5fcb-4e71-446d-830a-096b8658938a	checklist-photos	d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776680263572-3.jpg	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 10:17:46.38257+00	2026-04-20 10:17:46.38257+00	2026-04-20 10:17:46.38257+00	{"eTag": "\\"1f766d424451c665e8e0fb9a07c4c0e4\\"", "size": 2057340, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T10:17:46.366Z", "contentLength": 2057340, "httpStatusCode": 200}	498f9c9f-0f2f-465e-927e-6628ce6e02c0	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
f8c43a69-77ca-483f-8079-55c9fffbbec8	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776558859089-1.PNG	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 00:34:20.09183+00	2026-04-19 00:34:20.09183+00	2026-04-19 00:34:20.09183+00	{"eTag": "\\"ae0f0ab1b86ad521504ca1401f498a5d\\"", "size": 87428, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T00:34:20.083Z", "contentLength": 87428, "httpStatusCode": 200}	87254160-b693-4800-97bb-35c5be881f39	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
0989c323-7a30-4682-91f6-391e465d6a57	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776558859086-0.jpeg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 00:34:20.128853+00	2026-04-19 00:34:20.128853+00	2026-04-19 00:34:20.128853+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T00:34:20.123Z", "contentLength": 148343, "httpStatusCode": 200}	1507d632-0000-4c67-9271-7153724f8fb1	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
7997bfee-23b5-407d-82ab-5d8d74f67c73	delivery-photos	fuel_f043f0f1-93f3-45e7-8687-1a8c61fa3429_1776562097489.jpg	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	2026-04-19 01:28:18.404382+00	2026-04-19 01:28:18.404382+00	2026-04-19 01:28:18.404382+00	{"eTag": "\\"dc5699f6ce1caaa4a2d4f5308c201588\\"", "size": 39194, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T01:28:18.402Z", "contentLength": 39194, "httpStatusCode": 200}	93ef896a-7dd9-4938-b2c7-0e8741255248	b8a8ed1b-1eac-4dcb-bcc6-f9382d90e163	{}
c94a34a2-061d-4dfe-83dd-1cfbbdc599f5	delivery-photos	fuel_9579ac02-2a7a-4fa1-b6e0-5598f136f2dd_1776562703633.jpg	\N	2026-04-19 01:38:24.659201+00	2026-04-19 01:38:24.659201+00	2026-04-19 01:38:24.659201+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T01:38:24.655Z", "contentLength": 148343, "httpStatusCode": 200}	3c8205d8-d6ed-4f24-9f55-def2001a7082	\N	{}
66ce4e85-ede3-49a4-ac6a-b96fd7b75f19	checklist-photos	d3720269-de76-4244-ac07-9a0cc3b81da6/checklist-1776680263568-0.jpg	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 10:17:45.013722+00	2026-04-20 10:17:45.013722+00	2026-04-20 10:17:45.013722+00	{"eTag": "\\"d190e46d4d7855843de85db38ebb7b85\\"", "size": 44512, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T10:17:45.008Z", "contentLength": 44512, "httpStatusCode": 200}	b4bc33ce-3eaa-42e0-a4cf-11484726872d	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
394148f1-1deb-441c-832f-9137e4306805	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776611014493-0.jpeg	\N	2026-04-19 15:03:36.693284+00	2026-04-19 15:03:36.693284+00	2026-04-19 15:03:36.693284+00	{"eTag": "\\"197c617c18b2cd6b4e23dbd287baee5a\\"", "size": 16312, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T15:03:36.552Z", "contentLength": 16312, "httpStatusCode": 200}	481d79b0-2927-4b54-bbce-cddb5fbb501d	\N	{}
27fb0856-3975-4b58-b6a6-673687f2a6b9	delivery-photos	delivery_8b6c527f-ae6d-489a-a64f-2e24a7aab1c1_1776729325241.jpg	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	2026-04-20 23:55:28.781771+00	2026-04-20 23:55:28.781771+00	2026-04-20 23:55:28.781771+00	{"eTag": "\\"bf764e77ab7b7414bcb0e0a15900d3dd\\"", "size": 3975286, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T23:55:28.769Z", "contentLength": 3975286, "httpStatusCode": 200}	8da5651c-0667-4c4d-a611-482bc2a9cd5e	6f8a6be8-bf06-43f9-8706-5c6e0b7cf11e	{}
93f42149-cade-4ee3-9c06-96f998aa308f	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776611014498-2.jpeg	\N	2026-04-19 15:03:36.618213+00	2026-04-19 15:03:36.618213+00	2026-04-19 15:03:36.618213+00	{"eTag": "\\"e0d833315d013ff0f58791c5aa8d755c\\"", "size": 45784, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T15:03:36.552Z", "contentLength": 45784, "httpStatusCode": 200}	bab29e90-7fd4-461c-9110-8f83c25200f2	\N	{}
e59daa06-11ed-4267-8916-117fae647444	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776611014497-1.jpeg	\N	2026-04-19 15:03:36.713507+00	2026-04-19 15:03:36.713507+00	2026-04-19 15:03:36.713507+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T15:03:36.611Z", "contentLength": 148343, "httpStatusCode": 200}	47237a13-53f9-449b-80cf-f7ead5267a58	\N	{}
7ff165ab-692e-4298-bb26-09dbdb2fd38d	checklist-photos	cba34273-a0c6-4045-82d8-d877af385c2f/checklist-1776611014498-3.jpeg	\N	2026-04-19 15:03:36.713704+00	2026-04-19 15:03:36.713704+00	2026-04-19 15:03:36.713704+00	{"eTag": "\\"91916ad52181308e7191c2a6fbb0b5e9\\"", "size": 148343, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-19T15:03:36.611Z", "contentLength": 148343, "httpStatusCode": 200}	2e353e6f-0b63-4935-9b1c-da58b019d545	\N	{}
f1a0a090-fa42-42c1-9016-3aace40fd23c	delivery-photos	fuel_c3fc630c-17c5-41b3-90aa-3c455ff71123_1776689893466.jpg	398ef1e1-3188-4897-a203-dc4f0e4bedda	2026-04-20 12:58:13.83544+00	2026-04-20 12:58:13.83544+00	2026-04-20 12:58:13.83544+00	{"eTag": "\\"4c9fa5863d3cbce25db80b92db964a34\\"", "size": 40819, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-20T12:58:13.823Z", "contentLength": 40819, "httpStatusCode": 200}	4b3e55a5-88db-4625-b015-bb0bb9c749eb	398ef1e1-3188-4897-a203-dc4f0e4bedda	{}
19bb4c71-b5f2-41e1-a478-f729d2ca7c77	delivery-photos	delivery_070bb0d9-7982-4500-9b6b-f9cdf60a9f3b_1776730521008.jpg	dc1dd703-112a-4ac7-b947-2c81562896b7	2026-04-21 00:15:22.390303+00	2026-04-21 00:15:22.390303+00	2026-04-21 00:15:22.390303+00	{"eTag": "\\"290d0969450804fd4ee968c551132dbc\\"", "size": 16903, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-21T00:15:22.387Z", "contentLength": 16903, "httpStatusCode": 200}	cdd9071b-b2b6-4409-afd2-000bb5963348	dc1dd703-112a-4ac7-b947-2c81562896b7	{}
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.hooks (id, hook_table_id, hook_name, created_at, request_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.migrations (version, inserted_at) FROM stdin;
initial	2026-04-10 11:29:13.100033+00
20210809183423_update_grants	2026-04-10 11:29:13.100033+00
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 235, true);


--
-- Name: order_short_id_seq; Type: SEQUENCE SET; Schema: public; Owner: supabase_admin
--

SELECT pg_catalog.setval('public.order_short_id_seq', 72, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1534, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

