
@extends('admin.layouts.app')
@section('page_title', __('Provider Options'))
@section('css')
@endsection

@section('content')
    <!-- Main content -->
    <div class="col-sm-12" id="company-settings-container">
        <div class="card">
            <div class="card-body row">
                <div class="col-lg-3 col-12 z-index-10 pe-0 ps-0 ps-md-3">
                    @include('admin.layouts.includes.feature_menu')
                </div>
                <div class="col-lg-9 col-12 ps-0">
                    <div class="card card-info shadow-none mb-0">
                        <div class="card-header p-t-20 border-bottom">
                            <h5>{{ __(':x Options', ['x' => ucwords($providerName)]) }}</h5>
                            <div class="card-header-right">

                            </div>
                        </div>
                        

                        <div class="card-body">
                            @if ($featureOptions)
                            <div class="d-flex justify-content-start alert alert-warning">
                                <b>{{ __('Fields left blank or has single value won\'t be appear on the user panel.') }}</b>
                            </div>
                            @endif
                            <form method="post" action="{{ route('admin.features.provider_manage', [$featureName, $providerName]) }}" id="aiSettings">
                                @csrf
                                <div class="tab-content p-0 box-shadow-unset" id="topNav-v-pills-tabContent">

                                    @if (isset($fields) && !empty($fields))
                                        @foreach ($featureOptions as $option)
                                            @foreach ($fields as $field)
                                                @if ($option['name'] == $field['name'])

                                                    @if($option['type'] == 'checkbox')
                                                        <div class="form-group row">
                                                            <label for="rating"
                                                                class="col-sm-2 control-label text-left">{{ $field['label'] }}</label>
                                                            <div class="col-9 d-flex mt-neg-2">
                                                                <div class="ltr:me-3 rtl:ms-3">
                                                                    <div class="switch switch-bg d-inline m-r-10">
                                                                        <input type="checkbox" name="{{ $field['name'] }}"
                                                                            class="checkActivity" id="{{ $field['name'] }}"
                                                                             {{ $field['value'] == 'on' ? 'checked' : '' }} >
                                                                        <label for="{{ $field['name'] }}" class="cr"></label>
                                                                    </div>
                                                                </div>
                                                                <div class="mt-2">
                                                                    <span>{{ __('Enable :x for :y generation.', ['x' => ucwords($providerName), 'y' => ucwords($featureName)]) }}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    @endif

                                                    @if ($option['type'] == 'dropdown')
                                                        <div class="form-group row">
                                                            <div class="col-12">
                                                                <label for="{{ $option['name'] . '[]' }}" class="control-label">{{ $option['label'] }}</label>
                                                                <select class="form-control select2 inputFieldDesign sl_common_bx" name="{{ $option['name'] . '[]' }}" multiple>
                                                                    @foreach ($option['value'] as $value)
                                                                        <option value="{{ $value }}" {{ in_array($value, $field['value']) ? 'selected' : '' }}> {{ $value }} </option>
                                                                    @endforeach
                                                                </select>
                                                            </div>
                                                        </div>
                                                    @endif

                                                    @if ($option['type'] == 'integer')
                                                        <div class="form-group row">
                                                            <div class="col-12">
                                                                <label for="{{ $option['name'] }}" class="control-label">{{ $option['label'] }}</label>
                                                                <input class="form-control inputFieldDesign positive-int-number" type="{{ $option['type'] }}" name="{{ $option['name'] }}"
                                                                    id="{{ $option['name'] }}" value="{{ $field['value'] }}" >
                                                            </div>
                                                        </div>
                                                    @endif

                                                @endif
                                            @endforeach
                                        @endforeach
                                    @else
                                        @foreach ($featureOptions as $option)

                                            @if($option['type'] == 'checkbox')
                                                <div class="form-group row">
                                                    <label for="rating"
                                                        class="col-sm-2 control-label text-left">{{ $option['label'] }}</label>
                                                    <div class="col-9 d-flex mt-neg-2">
                                                        <div class="ltr:me-3 rtl:ms-3">
                                                            <div class="switch switch-bg d-inline m-r-10">
                                                                <input type="checkbox" name="{{ $option['name'] }}"
                                                                    class="checkActivity" id="{{ $option['name'] }}" {{ $option['value'] == 'on' ? 'checked' : '' }} >
                                                                <label for="{{ $option['name'] }}" class="cr"></label>
                                                            </div>
                                                        </div>
                                                        <div class="mt-2">
                                                            <span>{{ __('Enable :x for :y generation.', ['x' => ucwords($providerName), 'y' => ucwords($featureName)]) }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            @endif

                                            @if ($option['type'] == 'dropdown')
                                                <div class="form-group row">
                                                    <div class="col-12">
                                                        <label for="{{ $option['name'] }}" class="control-label">{{ $option['label'] }}</label>
                                                        <select class="form-control select2 inputFieldDesign sl_common_bx"
                                                            name="{{ $option['name'] . '[]' }}" multiple>
                                                            @foreach ($option['value'] as $value)
                                                                <option value="{{ $value }}" selected> {{ $value }} </option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                            @endif

                                            @if ($option['type'] == 'integer')
                                                <div class="form-group row">
                                                    <div class="col-12">
                                                        <label for="{{ $option['name'] }}" class="control-label">{{ $option['label'] }}</label>
                                                        <input class="form-control inputFieldDesign positive-int-number" type="{{ $option['type'] }}" name="{{ $option['name'] }}"
                                                            id="{{ $option['name'] }}" value="{{ $option['value'] }}" >
                                                    </div>
                                                </div>
                                            @endif

                                        @endforeach
                                    @endif
                                @if ($featureOptions)
                                <div class="footer py-0">
                                    <div class="form-group row">
                                        <label for="btn_save" class="col-sm-3 control-label"></label>
                                        <div class="m-auto">
                                            <button type="submit"
                                                class="btn form-submit custom-btn-submit float-right package-submit-button"
                                                id="footer-btn">{{ __('Save') }}</button>
                                        </div>
                                    </div>
                                </div>
                                @endif
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    @include('mediamanager::image.modal_image')

@endsection

@section('js')
<script src="{{ asset('public/dist/js/custom/validation.min.js') }}"></script>
@endsection
