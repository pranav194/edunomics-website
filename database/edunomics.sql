create table category(
    category_id int primary key auto_increment,
    name varchar(255) not null
);
create table career (
    career_id int primary key auto_increment,
    name varchar(255) not null, 
    category_id int not null,
    FOREIGN key(category_id) REFERENCES category(category_id)
);
create table blog (
    blog_id int primary key auto_increment,
    blog text,
    title varchar(255),
    subtitle varchar(255),
    slide_url varchar(255),
    category_id int not null,
    FOREIGN key (category_id) REFERENCES category(category_id)
);
create table skill (
    skill_id int primary key auto_increment,
    name varchar(255) not null,
    category_id int not null,
    FOREIGN key (category_id) REFERENCES category(category_id)
);
create table video(
  video_id int PRIMARY key auto_increment,
  video_url varchar(255) not null,
  blog_id int ,
  FOREIGN key (blog_id) REFERENCES blog(blog_id)
);
