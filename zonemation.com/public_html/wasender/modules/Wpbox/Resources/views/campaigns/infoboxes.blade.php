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

<div class="row mb-5">

    <div class="col-xl-3 col-md-6">

        <div class="card card-stats">
            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/Templates.svg') }}" class="nav-icon" alt="Paying clients">
                <div class="title-unique">{{ __('Template')}}</div>
                <div class="number-unique">{{ $item->template->name }}</div>
                <div class="subtext-unique">
                    <p class="mt-3 mb-0 text-sm">
                        @if ($item->timestamp_for_delivery > now())
                        <span class="text mr-2">{{ __('Scheduled for')}}: {{ date($item->timestamp_for_delivery) }}</span>
                        @else
                        <span class="text-v mr-2">{{ $item->timestamp_for_delivery?$item->timestamp_for_delivery:$item->created_at}}</span>
                        @endif

                    </p>
                </div>
            </div>

        </div>
    </div>

    @if ($item->is_bot)
    @elseif ($item->is_api)

    @else
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats">
            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/Contacts.svg') }}" class="nav-icon" alt="Paying clients">
                <div class="title-unique">{{ __('Contacts')}}</div>
                <div class="number-unique">{{ $item->send_to }}</div>
                <div class="subtext-unique">
                    <p class="mt-3 mb-0 text-sm">
                        <span class="text mr-2">
                            {{ round(($item->send_to/$total_contacts)*100,2)  }}% {{__('of your contacts')}}</span>
                    </p>
                </div>
            </div>

        </div>



    </div>
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats">
            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/Deliveredto.svg') }}" class="nav-icon" alt="Paying clients">
                <div class="title-unique">{{ __('Delivered to')}}</div>
                <div class="number-unique">{{ round(($item->delivered_to/$item->send_to)*100,2)  }}%</div>
                <div class="subtext-unique">
                    <p class="mt-3 mb-0 text-sm">
                        {{ $item->delivered_to }}
                        <span class="text-nowrap">{{ __('Contacts') }}</span>
                    </p>
                </div>
            </div>

        </div>
    </div>
    <div class="col-xl-3 col-md-6">
        <div class="card card-stats">
            <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/Readby.svg') }}" class="nav-icon" alt="Paying clients">
                <div class="title-unique">{{ __('Read by')}}</div>
                @if ($item->delivered_to>0)
                <div class="number-unique">{{ round(($item->read_by/$item->delivered_to)*100,2)  }}%</div>
                @else
                <div class="number-unique">0%</div>
                @endif
                <div class="subtext-unique">
                    <p class="mt-3 mb-0 text-sm">
                        <span class="text mr-2">
                            {{ $item->read_by }} {{ __('of the')}} {{$item->delivered_to}} {{__('Contacts messaged.')}}</span>

                    </p>
                </div>
            </div>

        </div>
    </div>
    @endif

</div>