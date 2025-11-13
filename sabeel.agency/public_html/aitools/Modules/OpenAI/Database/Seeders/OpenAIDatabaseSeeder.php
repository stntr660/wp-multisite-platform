<?php

namespace Modules\OpenAI\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

use Modules\OpenAI\Database\Seeders\versions\v1_2_0\DatabaseSeeder as DatabaseSeederV12;

use Modules\OpenAI\Database\Seeders\versions\v1_4_0\DatabaseSeeder as DatabaseSeederV14;
use Modules\OpenAI\Database\Seeders\versions\v1_5_0\DatabaseSeeder as DatabaseSeederV15;
use Modules\OpenAI\Database\Seeders\versions\v1_6_0\DatabaseSeeder as DatabaseSeederV16;
use Modules\OpenAI\Database\Seeders\versions\v1_7_0\DatabaseSeeder as DatabaseSeederV17;

use Modules\OpenAI\Database\Seeders\versions\v1_8_0\DatabaseSeeder as DatabaseSeederV18;
use Modules\OpenAI\Database\Seeders\versions\v2_0_0\DatabaseSeeder as DatabaseSeederV20;

use Modules\OpenAI\Database\Seeders\versions\v2_2_0\DatabaseSeeder as DatabaseSeederV22;
use Modules\OpenAI\Database\Seeders\versions\v2_3_0\DatabaseSeeder as DatabaseSeederV23;

use Modules\OpenAI\Database\Seeders\versions\v2_5_0\DatabaseSeeder as DatabaseSeederV25;

use Modules\OpenAI\Database\Seeders\versions\v2_6_0\DatabaseSeeder as DatabaseSeederV26;

class OpenAIDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        $this->call(UseCaseCategoriesTableSeeder::class);
        $this->call(UseCasesTableSeeder::class);
        $this->call(UseCaseUseCaseCategoryTableSeeder::class);
        $this->call(OptionsTableSeeder::class);
        $this->call(OptionMetaTableSeeder::class);
        $this->call(ContentTypeTableSeeder::class);
        $this->call(ContentTypeMetaTableSeeder::class);

        $this->call(AdminMenusTableSeeder::class);
        $this->call(MenuItemsTableSeeder::class);

        $this->call(DatabaseSeederV12::class);

        $this->call(ChatCategoriesTableSeeder::class);
        $this->call(ChatBotsTableSeeder::class);

        $this->call(DatabaseSeederV14::class);

        $this->call(DatabaseSeederV15::class);
        
        $this->call(DatabaseSeederV16::class);
        $this->call(DatabaseSeederV17::class);

        $this->call(DatabaseSeederV18::class);
        $this->call(DatabaseSeederV20::class);

        $this->call(DatabaseSeederV22::class);
        $this->call(DatabaseSeederV23::class);

        $this->call(DatabaseSeederV25::class);
        $this->call(DatabaseSeederV26::class);
    }
}
