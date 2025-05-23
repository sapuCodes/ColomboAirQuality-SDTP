PGDMP      2                }            sqdt    17.4    17.4 E    X           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            Y           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            Z           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            [           1262    16608    sqdt    DATABASE     j   CREATE DATABASE sqdt WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE sqdt;
                     postgres    false            �            1259    16609    contacts    TABLE     !  CREATE TABLE public.contacts (
    "Id" integer NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Phone" character varying(20) NOT NULL,
    "Email" character varying(100) NOT NULL,
    "Message" text NOT NULL,
    "SubmittedAt" timestamp with time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.contacts;
       public         heap r       postgres    false            �            1259    16615    Contacts_Id_seq    SEQUENCE     �   CREATE SEQUENCE public."Contacts_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Contacts_Id_seq";
       public               postgres    false    217            \           0    0    Contacts_Id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Contacts_Id_seq" OWNED BY public.contacts."Id";
          public               postgres    false    218            �            1259    16616    __EFMigrationsHistory    TABLE     �   CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);
 +   DROP TABLE public."__EFMigrationsHistory";
       public         heap r       postgres    false            �            1259    16619    admins    TABLE     �   CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash text NOT NULL
);
    DROP TABLE public.admins;
       public         heap r       postgres    false            �            1259    16624    admins_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.admins_id_seq;
       public               postgres    false    220            ]           0    0    admins_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;
          public               postgres    false    221            �            1259    16625    air_quality_stations    TABLE     �  CREATE TABLE public.air_quality_stations (
    id integer NOT NULL,
    station_name character varying(100) NOT NULL,
    latitude numeric(10,6) NOT NULL,
    longitude numeric(10,6) NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    aqi integer NOT NULL,
    pm25 numeric(5,1) NOT NULL,
    co numeric(5,1) NOT NULL,
    temperature numeric(4,1) NOT NULL,
    humidity numeric(5,1) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT air_quality_stations_aqi_check CHECK ((aqi >= 0)),
    CONSTRAINT air_quality_stations_co_check CHECK ((co >= (0)::numeric)),
    CONSTRAINT air_quality_stations_humidity_check CHECK (((humidity >= (0)::numeric) AND (humidity <= (100)::numeric))),
    CONSTRAINT air_quality_stations_latitude_check CHECK (((latitude >= ('-90'::integer)::numeric) AND (latitude <= (90)::numeric))),
    CONSTRAINT air_quality_stations_longitude_check CHECK (((longitude >= ('-180'::integer)::numeric) AND (longitude <= (180)::numeric))),
    CONSTRAINT air_quality_stations_pm25_check CHECK ((pm25 >= (0)::numeric))
);
 (   DROP TABLE public.air_quality_stations;
       public         heap r       postgres    false            �            1259    16636    air_quality_stations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.air_quality_stations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.air_quality_stations_id_seq;
       public               postgres    false    222            ^           0    0    air_quality_stations_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.air_quality_stations_id_seq OWNED BY public.air_quality_stations.id;
          public               postgres    false    223            �            1259    16637    cache    TABLE     �   CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);
    DROP TABLE public.cache;
       public         heap r       postgres    false            �            1259    16642    cache_locks    TABLE     �   CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);
    DROP TABLE public.cache_locks;
       public         heap r       postgres    false            �            1259    16647    failed_jobs    TABLE     &  CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.failed_jobs;
       public         heap r       postgres    false            �            1259    16653    failed_jobs_id_seq    SEQUENCE     {   CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.failed_jobs_id_seq;
       public               postgres    false    226            _           0    0    failed_jobs_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;
          public               postgres    false    227            �            1259    16654    job_batches    TABLE     d  CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);
    DROP TABLE public.job_batches;
       public         heap r       postgres    false            �            1259    16659    jobs    TABLE     �   CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);
    DROP TABLE public.jobs;
       public         heap r       postgres    false            �            1259    16664    jobs_id_seq    SEQUENCE     t   CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.jobs_id_seq;
       public               postgres    false    229            `           0    0    jobs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;
          public               postgres    false    230            �            1259    16665 
   migrations    TABLE     �   CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);
    DROP TABLE public.migrations;
       public         heap r       postgres    false            �            1259    16668    migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.migrations_id_seq;
       public               postgres    false    231            a           0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public               postgres    false    232            �            1259    16669    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16672    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    233            b           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    234            �           2604    16673 	   admins id    DEFAULT     f   ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);
 8   ALTER TABLE public.admins ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    220            �           2604    16674    air_quality_stations id    DEFAULT     �   ALTER TABLE ONLY public.air_quality_stations ALTER COLUMN id SET DEFAULT nextval('public.air_quality_stations_id_seq'::regclass);
 F   ALTER TABLE public.air_quality_stations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    222            �           2604    16675    contacts Id    DEFAULT     n   ALTER TABLE ONLY public.contacts ALTER COLUMN "Id" SET DEFAULT nextval('public."Contacts_Id_seq"'::regclass);
 <   ALTER TABLE public.contacts ALTER COLUMN "Id" DROP DEFAULT;
       public               postgres    false    218    217            �           2604    16676    failed_jobs id    DEFAULT     p   ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);
 =   ALTER TABLE public.failed_jobs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    226            �           2604    16677    jobs id    DEFAULT     b   ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);
 6   ALTER TABLE public.jobs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229            �           2604    16678    migrations id    DEFAULT     n   ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
 <   ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    231            �           2604    16679    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    233            F          0    16616    __EFMigrationsHistory 
   TABLE DATA           R   COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
    public               postgres    false    219   �Q       G          0    16619    admins 
   TABLE DATA           =   COPY public.admins (id, username, password_hash) FROM stdin;
    public               postgres    false    220   R       I          0    16625    air_quality_stations 
   TABLE DATA           �   COPY public.air_quality_stations (id, station_name, latitude, longitude, "timestamp", aqi, pm25, co, temperature, humidity, created_at, updated_at) FROM stdin;
    public               postgres    false    222   �R       K          0    16637    cache 
   TABLE DATA           7   COPY public.cache (key, value, expiration) FROM stdin;
    public               postgres    false    224   �S       L          0    16642    cache_locks 
   TABLE DATA           =   COPY public.cache_locks (key, owner, expiration) FROM stdin;
    public               postgres    false    225   �S       D          0    16609    contacts 
   TABLE DATA           \   COPY public.contacts ("Id", "Name", "Phone", "Email", "Message", "SubmittedAt") FROM stdin;
    public               postgres    false    217   �S       M          0    16647    failed_jobs 
   TABLE DATA           a   COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
    public               postgres    false    226   �T       O          0    16654    job_batches 
   TABLE DATA           �   COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
    public               postgres    false    228   �T       P          0    16659    jobs 
   TABLE DATA           c   COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
    public               postgres    false    229   �T       R          0    16665 
   migrations 
   TABLE DATA           :   COPY public.migrations (id, migration, batch) FROM stdin;
    public               postgres    false    231   �T       T          0    16669    users 
   TABLE DATA           :   COPY public.users (id, name, email, password) FROM stdin;
    public               postgres    false    233   [U       c           0    0    Contacts_Id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Contacts_Id_seq"', 6, true);
          public               postgres    false    218            d           0    0    admins_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.admins_id_seq', 3, true);
          public               postgres    false    221            e           0    0    air_quality_stations_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.air_quality_stations_id_seq', 6, true);
          public               postgres    false    223            f           0    0    failed_jobs_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);
          public               postgres    false    227            g           0    0    jobs_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);
          public               postgres    false    230            h           0    0    migrations_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.migrations_id_seq', 6, true);
          public               postgres    false    232            i           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public               postgres    false    234            �           2606    16681    contacts Contacts_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT "Contacts_pkey" PRIMARY KEY ("Id");
 B   ALTER TABLE ONLY public.contacts DROP CONSTRAINT "Contacts_pkey";
       public                 postgres    false    217            �           2606    16683 .   __EFMigrationsHistory PK___EFMigrationsHistory 
   CONSTRAINT     {   ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");
 \   ALTER TABLE ONLY public."__EFMigrationsHistory" DROP CONSTRAINT "PK___EFMigrationsHistory";
       public                 postgres    false    219            �           2606    16685    admins admins_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
       public                 postgres    false    220            �           2606    16687    admins admins_username_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);
 D   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_username_key;
       public                 postgres    false    220            �           2606    16689 .   air_quality_stations air_quality_stations_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.air_quality_stations
    ADD CONSTRAINT air_quality_stations_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.air_quality_stations DROP CONSTRAINT air_quality_stations_pkey;
       public                 postgres    false    222            �           2606    16691    cache_locks cache_locks_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);
 F   ALTER TABLE ONLY public.cache_locks DROP CONSTRAINT cache_locks_pkey;
       public                 postgres    false    225            �           2606    16693    cache cache_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);
 :   ALTER TABLE ONLY public.cache DROP CONSTRAINT cache_pkey;
       public                 postgres    false    224            �           2606    16695    failed_jobs failed_jobs_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_pkey;
       public                 postgres    false    226            �           2606    16697 #   failed_jobs failed_jobs_uuid_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);
 M   ALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_uuid_unique;
       public                 postgres    false    226            �           2606    16699    job_batches job_batches_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.job_batches DROP CONSTRAINT job_batches_pkey;
       public                 postgres    false    228            �           2606    16701    jobs jobs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_pkey;
       public                 postgres    false    229            �           2606    16703    migrations migrations_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.migrations DROP CONSTRAINT migrations_pkey;
       public                 postgres    false    231            �           2606    16705    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    233            �           2606    16707    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    233            �           1259    16708    jobs_queue_index    INDEX     B   CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);
 $   DROP INDEX public.jobs_queue_index;
       public                 postgres    false    229            F      x�34�LOOW(I-.����� )�4      G   u   x�=�=!@�c��\Ϡ��Y
�-������AX�6�P�5K���ĝ�T��#�핛��Zb1_y��	�v1����m�H�"����e�����pz�mc$�%^1�7s<(�      I   �   x���=O�@����QO�8��0t��X�T�J�A���phn�&b��(~��������p8���#t�0	"L���7F��[��g��P{A��@)�C ������b$��S�K꿅�`?�_�� ��d\4��F��S�իH�B�s�yH�H�:����vE����9��Sk�Q`��q�J��bU�Q��P� �5՜rW�-V,�u����r�\�1�:��Ϡ���&K�.%/��\��36s���&�������v�      K      x������ � �      L      x������ � �      D   �   x�U�1�0����8�뵥�n�..�Z��H0��{�'�Ჸ�� ��$��zKe�s��=���Pu@H*C�!��[i,iV I%Ψ��D���̛������-aM峯;Ϛ���y?��q���O$��*ŴΥQ��Ct!�� H�������;2)���
Ό4<7�ugI�|�?U      M      x������ � �      O      x������ � �      P      x������ � �      R   S   x�3�4000��"0'�(5�$5>919#5�$1)'�Ӑ�C�LaV~R1\�����i��q��y�����!�����"��=... �y$.      T   i   x�3�tL����L���9��I���E鹉�9z����*F�*��*�)���)U�)���>���ٮY�Q����ށiIN���n�Ya~ផ�iaU����.z\1z\\\ �p O     