import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { Subscription } from './subscription.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 100 }) name: string;
  @Column({ length: 30 }) stripeProductId: string;
  @Column({ length: 30 }) stripePriceId: string;
  @Column('int') priceCents: number;
  @Column({ length: 20 }) interval: string;
  @Column({ length: 5 }) currency: string;

  @OneToMany(() => Subscription, (s) => s.plan) subscriptions: Subscription[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt?: Date;
}
