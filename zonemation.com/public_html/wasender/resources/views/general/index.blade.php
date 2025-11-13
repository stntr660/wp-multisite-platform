<style type="text/css" media="all">
.custom-primary-button {
    background-color: #222;
    color: #A9D98C;
    border: none;
    border-radius: 8px;
    width:  15em;
    padding: 2% 0; /* Adjust padding for vertical expansion only */
    font-size: 12px;
    display: flex;
    cursor: pointer;
    margin: 5px;
    flex-direction: row; /* Ensure content stacks vertically */
    justify-content: center; /* Center content vertically */
    align-items: center; /* Center content horizontally */
    white-space: nowrap; /* Prevent text from wrapping */
}


    .custom-primary-icon {
        width: 1.8em !important;
        height: auto;
        /* Adjust size as needed */ 
        margin-right: 4px !important;
        margin-top: -1px;
        /* Adjust spacing as needed */
        filter: invert(91%) sepia(7%) saturate(2584%) hue-rotate(31deg) brightness(88%) contrast(91%);
    }
</style>
@extends('layouts.app', ['title' => __($title)])


@section('content')
<div class="header  pb-8 pt-5 pt-md-8">
    @isset($breadcrumbs)
    @include('general.breadcrumbs')
    @endisset
</div>
<div class="container-fluid mt--7">
    @yield('customheading')
    <div class="row">
        <div class="col">
            <div class="card shadow">
                <div class="card-header border-0">
                    <div class="row align-items-center">
                        <div class="col-8">
                            <h3 class="mb-0">{{ __($title) }}</h3>
                            @isset($subtitle)
                            <p class="mb-0">{{ $subtitle }}</p>
                            @endisset

                        </div>

                        <div class="col-4 text-right">
                            @isset($action_link)
                            <a href="{{ $action_link }}">
                                <button class="custom-primary-button">
                                    <img src="{{ asset('assets/img/'. str_replace(' ', '', __($action_name)) .'.svg') }}" class="custom-primary-icon" alt="{{ __($action_name) }}">
                                    {{ __($action_name) }}
                                </button></a>

                            @endisset
                            @isset($action_link2)
                            <a href="{{ $action_link2 }}">
                                <button class="custom-primary-button">
                                    <img src="{{ asset('assets/img/'. str_replace(' ', '', __($action_name2)) .'.svg') }}" class="custom-primary-icon" alt="{{ __($action_name2) }}">
                                    {{ __($action_name2) }}
                                </button></a>
                            @endisset
                            @isset($action_link3)
                            <a href="{{ $action_link3 }}">
                                <button class="custom-primary-button">
                                    <img src="{{ asset('assets/img/'. str_replace(' ', '', __($action_name3)) .'.svg') }}" class="custom-primary-icon" alt="{{ __($action_name3) }}">
                                    {{ __($action_name3) }}
                                </button></a>
                            @endisset
                            @isset($action_link4)
                            <a href="{{ $action_link4 }}">
                                <button class="custom-primary-button">
                                    <img src="{{ asset('assets/img/'. str_replace(' ', '', __($action_name4)) .'.svg') }}" class="custom-primary-icon" alt="{{ __($action_name4) }}">
                                    {{ __($action_name4) }}
                                </button></a>
                            @endisset
                            @isset($action_link5)
                            <a href="{{ $action_link5 }}">
                                <button class="custom-primary-button">
                                    <img src="{{ asset('assets/img/'. str_replace(' ', '', __($action_name5)) .'.svg') }}" class="custom-primary-icon" alt="{{ __($action_name5) }}">
                                    {{ __($action_name5) }}
                                </button></a>
                            @endisset
                            @isset($usefilter)
                            <button id="show-hide-filters" class="btn btn-icon btn-1 btn-sm btn-outline-secondary" type="button">
                                <span class="btn-inner--icon"><i id="button-filters" class="ni ni-bold-down"></i></span>
                            </button>
                            @endisset
                        </div>
                    </div>
                    @isset($usefilter)
                    @include('general.filters')
                    @endisset
                </div>

                <div class="col-12">
                    @include('partials.flash')
                </div>

                @yield('contenttop')
                @if (isset($iscontent))
                <div class="card-body">
                    @yield('cardbody')
                </div>
                @else
                @if(count($items))
                <div class="table-responsive">
                    <table class="table align-items-center table-flush">
                        <thead class="thead-light">
                            @if(isset($custom_table))
                            @yield('thead')
                            @else
                            @if(isset($fields))
                            @foreach ($fields as $field)
                            <th>{{ __( $field['name'] ) }}</th>
                            @endforeach
                            <th>{{ __('crud.actions') }}</th>
                            @else
                            @yield('thead')
                            @endif
                            @endif



                        </thead>
                        <tbody>
                            @yield('tbody')
                        </tbody>
                    </table>
                </div>
                @endif
                <div class="card-footer py-4">
                    @if(count($items))

                    @unless(isset($hidePaging) && $hidePaging)
                    <nav class="d-flex justify-content-end" aria-label="...">
                        {{ $items->links() }}
                    </nav>
                    @endunless
                    @else
                    <h4>{{__('crud.no_items',['items'=>$item_names])}}</h4>
                    @endif
                </div>
                @endif


            </div>
        </div>
    </div>

    @include('layouts.footers.auth')
</div>
@endsection