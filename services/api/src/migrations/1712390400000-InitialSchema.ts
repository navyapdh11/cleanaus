import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class InitialSchema1712390400000 implements MigrationInterface {
  name = 'InitialSchema1712390400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create regions table
    await queryRunner.createTable(new Table({
      name: 'regions',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'code', type: 'varchar', length: '10', isUnique: true },
        { name: 'name', type: 'varchar' },
        { name: 'state', type: 'varchar' },
        { name: 'timezone', type: 'varchar', default: "'Australia/Sydney'" },
        { name: 'is_active', type: 'boolean', default: true },
        { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create service_areas table
    await queryRunner.createTable(new Table({
      name: 'service_areas',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'region_id', type: 'uuid' },
        { name: 'name', type: 'varchar' },
        { name: 'postcode', type: 'varchar', length: '10' },
        { name: 'is_remote', type: 'boolean', default: false },
        { name: 'surcharge_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 },
        { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create services table
    await queryRunner.createTable(new Table({
      name: 'services',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'type', type: 'enum', enum: ['regular_cleaning', 'deep_cleaning', 'end_of_lease_cleaning', 'office_cleaning', 'carpet_cleaning', 'window_cleaning', 'airbnb_turnover', 'eco_friendly_cleaning', 'oven_cleaning', 'pressure_washing'] },
        { name: 'category', type: 'enum', enum: ['residential', 'commercial', 'specialized', 'add_on'] },
        { name: 'name', type: 'varchar' },
        { name: 'description', type: 'text' },
        { name: 'base_price', type: 'decimal', precision: 10, scale: 2 },
        { name: 'price_per_hour', type: 'decimal', precision: 10, scale: 2 },
        { name: 'estimated_duration_hours', type: 'decimal', precision: 4, scale: 2 },
        { name: 'included_tasks', type: 'text', isArray: true, default: "'{}'" },
        { name: 'available_regions', type: 'text', isArray: true, default: "'{}'" },
        { name: 'add_on_service_ids', type: 'text', isArray: true, default: "'{}'" },
        { name: 'is_active', type: 'boolean', default: true },
        { name: 'eco_friendly', type: 'boolean', default: false },
        { name: 'requires_special_equipment', type: 'boolean', default: false },
        { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create staff table
    await queryRunner.createTable(new Table({
      name: 'staff',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'first_name', type: 'varchar' },
        { name: 'last_name', type: 'varchar' },
        { name: 'email', type: 'varchar', isUnique: true },
        { name: 'phone', type: 'varchar' },
        { name: 'role', type: 'enum', enum: ['cleaner', 'team_lead', 'supervisor', 'manager'] },
        { name: 'status', type: 'enum', enum: ['active', 'on_leave', 'inactive'] },
        { name: 'skills', type: 'text', isArray: true, default: "'{}'" },
        { name: 'assigned_regions', type: 'text', isArray: true, default: "'{}'" },
        { name: 'max_daily_bookings', type: 'int', default: 5 },
        { name: 'current_daily_bookings', type: 'int', default: 0 },
        { name: 'quality_score', type: 'decimal', precision: 3, scale: 2, default: 5.0 },
        { name: 'total_bookings_completed', type: 'int', default: 0 },
        { name: 'police_check_verified', type: 'boolean', default: false },
        { name: 'police_check_expiry', type: 'timestamp', isNullable: true },
        { name: 'insurance_verified', type: 'boolean', default: false },
        { name: 'availability', type: 'jsonb', default: "'{}'" },
        { name: 'bio', type: 'text', isNullable: true },
        { name: 'profile_photo_url', type: 'varchar', isNullable: true },
        { name: 'emergency_contact', type: 'jsonb', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create customers table
    await queryRunner.createTable(new Table({
      name: 'customers',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'user_id', type: 'uuid', isNullable: true },
        { name: 'first_name', type: 'varchar' },
        { name: 'last_name', type: 'varchar' },
        { name: 'email', type: 'varchar', isUnique: true },
        { name: 'phone', type: 'varchar' },
        { name: 'status', type: 'enum', enum: ['active', 'inactive', 'suspended'] },
        { name: 'tier', type: 'enum', enum: ['bronze', 'silver', 'gold', 'platinum'] },
        { name: 'total_bookings', type: 'int', default: 0 },
        { name: 'completed_bookings', type: 'int', default: 0 },
        { name: 'cancelled_bookings', type: 'int', default: 0 },
        { name: 'total_spent', type: 'decimal', precision: 10, scale: 2, default: 0 },
        { name: 'loyalty_points', type: 'int', default: 0 },
        { name: 'default_address', type: 'jsonb', isNullable: true },
        { name: 'preferences', type: 'jsonb', isNullable: true },
        { name: 'communication_preferences', type: 'jsonb', default: "'{\"email\": true, \"sms\": false, \"push\": false}'" },
        { name: 'referral_code', type: 'varchar', isUnique: true },
        { name: 'referred_by', type: 'varchar', isNullable: true },
        { name: 'last_booking_at', type: 'timestamp', isNullable: true },
        { name: 'churn_risk_score', type: 'decimal', precision: 3, scale: 2, default: 0 },
        { name: 'notes', type: 'text', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create bookings table
    await queryRunner.createTable(new Table({
      name: 'bookings',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'customer_id', type: 'uuid' },
        { name: 'service_id', type: 'uuid', isNullable: true },
        { name: 'staff_id', type: 'uuid', isNullable: true },
        { name: 'service_details', type: 'jsonb' },
        { name: 'status', type: 'enum', enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'] },
        { name: 'priority', type: 'enum', enum: ['low', 'standard', 'high', 'urgent'] },
        { name: 'scheduled_date', type: 'timestamp' },
        { name: 'start_time', type: 'varchar' },
        { name: 'end_time', type: 'varchar', isNullable: true },
        { name: 'total_amount', type: 'decimal', precision: 10, scale: 2 },
        { name: 'property_details', type: 'jsonb' },
        { name: 'customer_preferences', type: 'jsonb', isNullable: true },
        { name: 'special_instructions', type: 'text', isNullable: true },
        { name: 'region_info', type: 'jsonb' },
        { name: 'payment_intent_id', type: 'varchar', isNullable: true },
        { name: 'completed_at', type: 'timestamp', isNullable: true },
        { name: 'cancelled_at', type: 'timestamp', isNullable: true },
        { name: 'cancellation_reason', type: 'text', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create pricing_rules table
    await queryRunner.createTable(new Table({
      name: 'pricing_rules',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'type', type: 'enum', enum: ['base_rate', 'demand_multiplier', 'loyalty_discount', 'region_surcharge', 'urgent_booking_fee', 'bundle_discount'] },
        { name: 'name', type: 'varchar' },
        { name: 'description', type: 'text' },
        { name: 'multiplier', type: 'decimal', precision: 5, scale: 3, default: 1.0 },
        { name: 'fixed_amount', type: 'decimal', precision: 10, scale: 2, isNullable: true },
        { name: 'conditions', type: 'jsonb', default: "'{}'" },
        { name: 'applies_to_regions', type: 'text', isArray: true, default: "'{}'" },
        { name: 'applies_to_services', type: 'text', isArray: true, default: "'{}'" },
        { name: 'valid_from', type: 'timestamp', isNullable: true },
        { name: 'valid_until', type: 'timestamp', isNullable: true },
        { name: 'is_active', type: 'boolean', default: true },
        { name: 'priority', type: 'int', default: 0 },
        { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create dispatch_assignments table
    await queryRunner.createTable(new Table({
      name: 'dispatch_assignments',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'booking_id', type: 'uuid' },
        { name: 'staff_id', type: 'uuid' },
        { name: 'team_lead_id', type: 'uuid', isNullable: true },
        { name: 'additional_staff_ids', type: 'text', isArray: true, default: "'{}'" },
        { name: 'status', type: 'enum', enum: ['assigned', 'en_route', 'in_progress', 'completed', 'cancelled'] },
        { name: 'assigned_at', type: 'timestamp' },
        { name: 'confidence_score', type: 'decimal', precision: 5, scale: 2 },
        { name: 'assignment_reason', type: 'jsonb' },
        { name: 'estimated_travel_time_min', type: 'int', isNullable: true },
        { name: 'estimated_duration_min', type: 'int', isNullable: true },
        { name: 'route_info', type: 'jsonb', isNullable: true },
        { name: 'en_route_at', type: 'timestamp', isNullable: true },
        { name: 'started_at', type: 'timestamp', isNullable: true },
        { name: 'completed_at', type: 'timestamp', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create notifications table
    await queryRunner.createTable(new Table({
      name: 'notifications',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'customer_id', type: 'uuid' },
        { name: 'booking_id', type: 'uuid', isNullable: true },
        { name: 'payment_id', type: 'varchar', isNullable: true },
        { name: 'channel', type: 'enum', enum: ['email', 'sms', 'push'] },
        { name: 'type', type: 'enum', enum: ['booking_confirmation', 'booking_reminder', 'staff_assigned', 'payment_received', 'review_request', 'cancellation', 'general'] },
        { name: 'subject', type: 'varchar' },
        { name: 'body', type: 'text' },
        { name: 'template_data', type: 'jsonb', isNullable: true },
        { name: 'status', type: 'enum', enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'] },
        { name: 'sent_at', type: 'timestamp', isNullable: true },
        { name: 'delivered_at', type: 'timestamp', isNullable: true },
        { name: 'error_message', type: 'text', isNullable: true },
        { name: 'retry_count', type: 'int', default: 0 },
        { name: 'max_retries', type: 'int', default: 3 },
        { name: 'external_id', type: 'varchar', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create agent_decisions table (for OASIS)
    await queryRunner.createTable(new Table({
      name: 'agent_decisions',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
        { name: 'task_id', type: 'varchar' },
        { name: 'agent_name', type: 'varchar' },
        { name: 'action', type: 'varchar' },
        { name: 'confidence', type: 'decimal', precision: 5, scale: 2 },
        { name: 'reasoning', type: 'text', isArray: true, default: "'{}'" },
        { name: 'alternatives', type: 'jsonb', isNullable: true },
        { name: 'metadata', type: 'jsonb', isNullable: true },
        { name: 'timestamp', type: 'timestamp', default: 'NOW()' },
      ],
    }), true);

    // Create indexes
    await queryRunner.createIndices('bookings', [
      new TableIndex({ name: 'IDX_BOOKINGS_CUSTOMER', columnNames: ['customer_id'] }),
      new TableIndex({ name: 'IDX_BOOKINGS_STATUS', columnNames: ['status'] }),
      new TableIndex({ name: 'IDX_BOOKINGS_SCHEDULED', columnNames: ['scheduled_date'] }),
    ]);

    await queryRunner.createIndices('staff', [
      new TableIndex({ name: 'IDX_STAFF_STATUS', columnNames: ['status'] }),
      new TableIndex({ name: 'IDX_STAFF_REGIONS', columnNames: ['assigned_regions'], isSpatial: false }),
    ]);

    await queryRunner.createIndices('customers', [
      new TableIndex({ name: 'IDX_CUSTOMERS_EMAIL', columnNames: ['email'] }),
      new TableIndex({ name: 'IDX_CUSTOMERS_TIER', columnNames: ['tier'] }),
    ]);

    await queryRunner.createIndices('dispatch_assignments', [
      new TableIndex({ name: 'IDX_DISPATCH_BOOKING', columnNames: ['booking_id'] }),
      new TableIndex({ name: 'IDX_DISPATCH_STAFF', columnNames: ['staff_id'] }),
      new TableIndex({ name: 'IDX_DISPATCH_STATUS', columnNames: ['status'] }),
    ]);

    await queryRunner.createIndices('notifications', [
      new TableIndex({ name: 'IDX_NOTIF_CUSTOMER', columnNames: ['customer_id'] }),
      new TableIndex({ name: 'IDX_NOTIF_BOOKING', columnNames: ['booking_id'] }),
      new TableIndex({ name: 'IDX_NOTIF_STATUS', columnNames: ['status'] }),
    ]);

    // Create foreign keys
    await queryRunner.createForeignKey('bookings', new TableForeignKey({
      columnNames: ['customer_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'customers',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('bookings', new TableForeignKey({
      columnNames: ['service_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'services',
      onDelete: 'SET NULL',
    }));

    await queryRunner.createForeignKey('bookings', new TableForeignKey({
      columnNames: ['staff_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'staff',
      onDelete: 'SET NULL',
    }));

    await queryRunner.createForeignKey('dispatch_assignments', new TableForeignKey({
      columnNames: ['booking_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'bookings',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('dispatch_assignments', new TableForeignKey({
      columnNames: ['staff_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'staff',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('notifications', new TableForeignKey({
      columnNames: ['customer_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'customers',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('service_areas', new TableForeignKey({
      columnNames: ['region_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'regions',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order to handle foreign key constraints
    await queryRunner.dropTable('agent_decisions', true);
    await queryRunner.dropTable('notifications', true);
    await queryRunner.dropTable('dispatch_assignments', true);
    await queryRunner.dropTable('pricing_rules', true);
    await queryRunner.dropTable('bookings', true);
    await queryRunner.dropTable('customers', true);
    await queryRunner.dropTable('staff', true);
    await queryRunner.dropTable('services', true);
    await queryRunner.dropTable('service_areas', true);
    await queryRunner.dropTable('regions', true);
  }
}
