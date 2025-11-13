@extends('layouts.app', ['title' => __('Chat'), 'hideActions'=>true ])
@section('content')
<div class="col-12">
    @include('partials.flash')
</div>
<div class="container-fluid">
    <div id="flow" data='{{ $data }}'></div>
</div>
@endsection

  
@section('js')
    <script src="{{ '/flowmaker/script' }}"></script>
@endsection
