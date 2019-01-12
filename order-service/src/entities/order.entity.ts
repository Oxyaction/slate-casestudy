import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type State = 'created' | 'confirmed' | 'delivered' | 'cancelled';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'state',
    type: 'enum',
    enum: ['created', 'confirmed', 'delivered', 'cancelled' ],
    default: 'created'
  })
  state: State;
}
