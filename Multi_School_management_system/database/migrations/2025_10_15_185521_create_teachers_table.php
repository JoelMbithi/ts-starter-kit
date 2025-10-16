<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->increments('teacher_id'); // Primary key
            $table->unsignedInteger('tenant_id'); // Match tenants.tenant_id
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->string('subject', 50);
            $table->timestamps();

            //  Foreign key matches tenants table column
            $table->foreign('tenant_id')
                  ->references('tenant_id')
                  ->on('tenants')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
