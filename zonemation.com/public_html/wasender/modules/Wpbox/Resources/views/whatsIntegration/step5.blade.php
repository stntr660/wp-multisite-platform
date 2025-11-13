@extends('layouts.app', ['title' => 'step 5'])
@section('content')
<div class="header pb-8 pt-2 pt-md-7">
    <div class="container-fluid">
        <div class="header-body">
            <h1 class="mb-3 mt--3">💬 step 5</h1>
            <div class="row align-items-center pt-2">
            </div>
        </div>
    </div>
</div>
<div class="container-fluid mt--8">  
    <form method="post" action="{{ url('/whatsapp/step5') }}">
        @csrf
        <!-- Your form fields go here -->
        <button type="submit">Next</button>
    </form>
</div>
@endsection
