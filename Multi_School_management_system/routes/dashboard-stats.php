use Illuminate\Support\Facades\Route;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Course;

Route::get('/dashboard-stats', function () {
    return response()->json([
        'students' => Student::count(),
        'teachers' => Teacher::count(),
        'courses' => Course::count(),
    ]);
});
