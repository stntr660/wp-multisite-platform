<style>
    .card-unique {
        background-color: #222823;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #d9e9b7;
        font-family: Arial, sans-serif;
        position: relative;
    }

    .icon-unique {
        width: 15% !important;
        margin-top: 10%;
        height: auto !important;
        filter: invert(84%) sepia(12%) saturate(1420%) hue-rotate(39deg) brightness(95%) contrast(86%) !important;
    }

    .title-unique {
        margin-top: 1%;
        font-size: 20px;
        color: white;
    }

    .number-unique {
        font-size: 30px;
        margin-top: -10px;
    }

    .subtext-unique {
        font-size: 14px;
        color: #9a9a9a;

        margin-bottom: 4%;
    }
</style>

@hasrole('admin')
<div class="row">
    @if (config('settings.admin_companies_enabled',true))
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats">

            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/Contacts.svg') }}" class="nav-icon" alt="Contacts">
                <div class="title-unique">{{ __('Users')}}</div>
                <div class="number-unique">{{ $dashboard['total_users'] }}</div>
                <div class="subtext-unique">{{ $dashboard['users_this_month'] }} {{ __('this month') }}</div>
            </div>
        </div>
    </div>
    @endif
    @if (config('settings.enable_pricing'))
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats shadow-lg">

            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/PayingClients.svg') }}" class="nav-icon" alt="Paying clients">
                <div class="title-unique">{{ __('Paying clients')}}</div>
                <div class="number-unique">{{ $dashboard['total_paying_users'] }}</div>
                <div class="subtext-unique">{{ $dashboard['total_paying_users_this_month'] }} {{ __('this month') }}</div>
            </div>
        </div>
    </div>
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats shadow-lg">

            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/mrr.svg') }}" class="nav-icon" alt="Paying clients">
                <div class="title-unique">{{ __('MRR')}}</div>
                <div class="number-unique">{{ $dashboard['mrr'] }}</div>

            </div>

        </div>
    </div>
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats shadow-lg ">

            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/arr.svg') }}" class="nav-icon" alt="Paying clients">
                <div class="title-unique">{{ __('ARR')}}</div>
                <div class="number-unique">{{ $dashboard['arr'] }}</div>

            </div>
        </div>
    </div>
    @else
    <!-- Payment based on usage -->
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats shadow-lg">

            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/Documents.svg') }}" class="nav-icon" alt="Documents">
                <div class="title-unique">{{ __('Documents')}}</div>
                <div class="number-unique">{{ $dashboard['total_docs_np'] }}</div>
                <div class="subtext-unique">{{ $dashboard['month_docs_np'] }} {{ __('this month') }}</div>
            </div>


        </div>
    </div>
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats shadow-lg">


            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/ThisMonth.svg') }}" class="nav-icon" alt="Documents">
                <div class="title-unique">{{ __('This month')}}</div>
                <div class="number-unique">{{ $dashboard['month'] }}</div>
                <div class="subtext-unique">{{ $dashboard['month_docs'] }} {{ __('Documents') }}</div>
            </div>

        </div>
    </div>
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats shadow-lg">
            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/Total.svg') }}" class="nav-icon" alt="total">
                <div class="title-unique">{{ __('Total')}}</div>
                <div class="number-unique">{{ $dashboard['total'] }}</div>
                <div class="subtext-unique"> {{ $dashboard['total_docs'] }} {{ __('Documents') }}</div>
            </div>

        </div>
    </div>
    @endif

</div>
@endhasrole

@hasrole('admin')
@section('dashboard_content2')
@if (config('settings.admin_companies_enabled',true))
<div class="row">
    <div class="col-xl-12">
        <div class="card">
            <div class="card-header border-0">
                <div class="row align-items-center">
                    <div class="col">
                        <h3 class="mb-0">{{ __('Latest companies') }}</h3>
                    </div>
                    <div class="col text-right">
                        <a href="{{ route('admin.companies.index') }}" class="btn btn-sm btn-primary">{{ __('See all') }}</a>
                    </div>
                </div>
            </div>
            <div class="table-responsive">

                <table class="table align-items-center table-flush">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">{{ __('Company') }}</th>
                            <th scope="col">{{ __('Creation Date') }}</th>
                            <th scope="col">{{ __('Name') }}</th>
                            <th scope="col">{{ __('Email') }}</th>
                            @if (config('settings.enable_pricing'))
                            <th scope="col">{{ __('Plan') }}</th>
                            @endif
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ( $dashboard['clients'] as $client )
                        @if ($client->user)
                        <tr>
                            <td scope="row">
                                <a href="{{ route('admin.companies.edit',$client->id)}}">{{ $client->name }}</a>
                            </td>
                            <td>{{ $client->created_at->locale(Config::get('app.locale'))->isoFormat('LLLL') }}</td>
                            <td>
                                {{ $client->user->name }}
                            </td>
                            <td>
                                {{ $client->user->email }}
                            </td>
                            @if (config('settings.enable_pricing'))
                            <td>
                                @isset($dashboard['plans'])
                                @isset($dashboard['plans'][$client->user->plan_id])
                                {{ $dashboard['plans'][$client->user->plan_id] }}
                                @endisset
                                @endisset

                            </td>
                            @endif
                            <td>
                                <a class="btn btn-sm btn-primary text-white" href="{{ route('admin.companies.loginas',  $client)}}">{{ __('Login as') }}</a>
                                @if (config('settings.show_company_page',true))
                                <a target="_blank" href="{{ $client->getLinkAttribute() }}" class="btn btn-sm btn-success">{{ __('View it') }}</a>
                                @endif

                            </td>
                        </tr>
                        @endif

                        @endforeach

                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="col-xl-4">
    </div>
</div>
@endif
@endsection
@endhasrole