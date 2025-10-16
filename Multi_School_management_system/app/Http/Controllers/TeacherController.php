<?php

namespace App\Http\Controllers;

use Illuminate\support\Facades\Auth;
use App\Model\Teacher;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;

class TeacherController extends Controller
{

    //Show All teachers
   public function index()
{
    $tenantId = Auth::user()->tenant_id;
    $teachers = Teacher::where('tenant_id', $tenantId)->get();

    return Inertia::render('teacher/index', [
        'tenant_id' => $tenantId,
        'teachers' => $teachers,
    ]);
}

//create new Teacher
  public function create(){
     return Inertia::render('teacher/Create');
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
    return Inertia::render('teacher/Edit',[
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
    $teacher -> upadte($validated);

    return Redirect::route('teachers.index')-> with('success', 'Teacher updated successfully!');
}
//delete teacher

public function destroy(Teacher $teacher){
    $teacher->delete();
    return Redirect::route('teachers.index')->with("success", "Teacher successfully Deleted");
}

}
