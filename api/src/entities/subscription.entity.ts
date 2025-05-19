import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('subscription')
export class Subscription {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => User, (u) => u.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => SubscriptionPlan, (p) => p.subscriptions)
  @JoinColumn({ name: 'subscription_plan_id' })
  plan: SubscriptionPlan;

  @Column({ length: 50 }) stripeSubscriptionId: string;
  @Column({ length: 50 }) stripeCustomerId: string;
  @Column({ length: 20 }) status: string;
  @Column('boolean', { default: false }) cancelAtPeriodEnd: boolean;
  @Column('date') currentPeriodStart: string;
  @Column('date') currentPeriodEnd: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
  @Column('timestamptz', { nullable: true }) canceledAt?: Date;
  @Column('timestamptz', { nullable: true }) endedAt?: Date;
  @Column('json', { nullable: true }) metadata?: any;
}
