import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rule', length: 50 })
  rule: string;

  @Column({ name: 'module', length: 50 })
  module: string;

  @Column({ name: 'can_read', type: 'boolean', default: false })
  canRead: boolean;

  @Column({ name: 'can_create', type: 'boolean', default: false })
  canCreate: boolean;

  @Column({ name: 'can_edit', type: 'boolean', default: true })
  canEdit: boolean;

  @Column({ name: 'can_delete', type: 'boolean', default: true })
  canDelete: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
