<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    // Show all students
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $students = Student::where('tenant_id', $tenantId)->get();
        $totalStudents = $students->count();

        return Inertia::render('Students/page', [
            'tenant_id' => $tenantId,
            'students' => $students,
            'totalStudents' => $totalStudents,
        ]);
    }

    // Show create student form
    public function create()
    {
        return Inertia::render('Students/Create');
    }

    // Store a new student
    public function store(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'grade' => 'required|string|max:10',
            'class' => 'required|string|max:10',
            'age' => 'required|integer|min:3',
            'registration_number' => 'required|string|unique:students,registration_number',
        ]);

        $student = Student::create(array_merge($validated, [
            'tenant_id' => $tenantId,
        ]));
 return Redirect::route('students.index')->with('success', 'Student added successfully!');
    }

    // Show edit student form
    public function edit(Student $student)
    {
        return Inertia::render('Students/Edit', [
            'student' => $student,
        ]);
    }

    // Update an existing student
public function update(Request $request, Student $student)
{
    $validated = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'grade' => 'required|string|max:10',
        'class' => 'required|string|max:10',
        'age' => 'required|integer|min:3',
        'registration_number' => 'required|string|unique:students,registration_number,' . $student->id,
    ]);

    $student->update($validated);

    // Return JSON for Inertia useForm
    return response()->json([
        'message' => 'Student updated successfully!',
        'student' => $student,
    ]);
}

    // Delete a student
    public function destroy(Student $student)
    {
        $student->delete();
        return Redirect::route('students.index')->with('success', 'Student successfully deleted');
    }

    // Search students
    public function search(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;
        $query = $request->input('query');

        $students = Student::where('tenant_id', $tenantId)
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'ILIKE', "%{$query}%")
                  ->orWhere('last_name', 'ILIKE', "%{$query}%")
                  ->orWhere('registration_number', 'ILIKE', "%{$query}%")
                  ->orWhere('grade', 'ILIKE', "%{$query}%")
                  ->orWhere('class', 'ILIKE', "%{$query}%");
            })
            ->get();

        return response()->json($students);
    }
}
