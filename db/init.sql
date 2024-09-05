create schema bandito;
use bandito;

create table pet
(
    id   int         not null auto_increment,
    name varchar(45) not null,
    primary key (id)
);

create table event
(
    id     int         not null auto_increment,
    time   timestamp   not null default current_timestamp,
    type   varchar(45) not null default 'feed',
    pet_id int         null,
    primary key (id),
    index pet_id_idx (pet_id asc) visible,
    constraint pet_id_fk
        foreign key (pet_id)
            references bandito.pet (id)
            on delete cascade
            on update no action
);

insert into pet (name) values ('Bandit');

insert into event (pet_id) values ((select id from pet))

