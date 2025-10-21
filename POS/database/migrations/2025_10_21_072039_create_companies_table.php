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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->default('JoesoftWork POS');
             $table->string('company_address')->default('JoesoftWork');
             $table->string('company_phone')->default('+254 743 861 565');
             $table->string('company_email')->default('JoesoftWork@gmail.com');
             $table->string('company_fax')->default('+254 740 196 027');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
