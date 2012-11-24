<?php

class Create_Users_Table {

	/**
	 * Make changes to the database.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('users', function($table) {
			// auto incremental id (PK)
			$table->increments('id');
			// varchar 32
			$table->string('name', 50);
			$table->string('email', 100);
			$table->string('phone', 15);
			$table->text('description');
			// created_at | updated_at DATETIME
			$table->timestamps();
			$table->engine = 'InnoDB';
		});
	}

	/**
	 * Revert the changes to the database.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('users');
	}

}