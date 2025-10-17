<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use App\Models\Teacher;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{

    //Show All teachers
   public function index()
{
    $tenantId = Auth::user()->tenant_id;
    $teachers = Teacher::where('tenant_id', $tenantId)->get();
      $totalTeachers = $teachers->count();

    return Inertia::render('Teachers/page', [
        'tenant_id' => $tenantId,
        'teachers' => $teachers,
        'totalTeachers' => $totalTeachers,
    ]);
}

//create new Teacher
  public function create(){
     return Inertia::render('Teachers/Create');
  }

  //Save a new teacher
  public function store (Request $request){
    $validated = $request->validate([
         'first_name'=> 'required|string|max:255',
         'last_name'=> 'required|string|max:255',
         'subject'=>'required|string|max:255',

    ]);

    $validated['tenant_id'] = Auth::user()->tenant_id;
    Teacher::create($validated);
    return Redirect::route('teachers.index')->with('success', 'Teacher added successfully!');
        
  }

  //edit teacher
  public function edit ()  {
    return Inertia::render('Teacher/Edit',[
    'teacher' => $teacher,
    ]);
}

//updating Tacher

public function update (Request $request, Teacher $teacher){
    $validated = $request-> validate([
        'first_name'=>'required|string|max:255',
        'last_name'=> 'required|string|max:255',
        'subject' => 'required|string|max:255',

    ]);
    $teacher -> update($validated);

    return Redirect::route('teachers.index')-> with('success', 'Teacher updated successfully!');
}
//delete teacher

public function destroy(Teacher $teacher){
    $teacher->delete();
    return Redirect::route('teachers.index')->with("success", "Teacher successfully Deleted");
}

public function search(Request $request)
{
    $tenantId = Auth::user()->tenant_id;
    $query = $request->input('query');

    $teachers = Teacher::where('tenant_id', $tenantId)
        ->where(function ($q) use ($query) {
            $q->where('first_name', 'ILIKE', "%{$query}%")
              ->orWhere('last_name', 'ILIKE', "%{$query}%")
              ->orWhere('subject', 'ILIKE', "%{$query}%");
        })
        ->get();

    return response()->json($teachers);
}


}


