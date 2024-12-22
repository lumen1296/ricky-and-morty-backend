import { ObjectType, Field, Int } from "@nestjs/graphql"
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { GraphQLJSONObject } from 'graphql-type-json'
@Table
@ObjectType()
export class Character extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    @Field((type) => Int)
    id: number;
    @Column
    @Field()
    name: string;
    @Column
    @Field()
    status: string;
    @Column
    @Field()
    species: string;
    @Column
    @Field()
    type: string;
    @Column
    @Field()
    gender: string;
    @Column(DataType.JSONB)
    @Field((type) => GraphQLJSONObject)
    origin: { name: string, url: string };
    @Column(DataType.JSONB)
    @Field((type) => GraphQLJSONObject)
    location: object;
    @Column
    @Field()
    image: string;
    @Column(DataType.ARRAY(DataType.STRING))
    @Field((type) => [String])
    episode: Array<string>;
    @Column
    @Field()
    url: string;
    @Column
    @Field()
    created: string;
}