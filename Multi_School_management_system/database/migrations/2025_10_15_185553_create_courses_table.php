<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->increments('course_id'); // Primary key

            // Foreign key columns
            $table->integer('tenant_id')->unsigned();
            $table->integer('teacher_id')->unsigned();

            $table->string('course_name', 100);

            // Automatically adds created_at and updated_at
            $table->timestamps();

            // Optional: Add foreign key constraints (if tables exist)
            $table->foreign('tenant_id')
                  ->references('tenant_id')
                  ->on('tenants')
                  ->onDelete('cascade');

            $table->foreign('teacher_id')
                  ->references('teacher_id')
                  ->on('teachers')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
