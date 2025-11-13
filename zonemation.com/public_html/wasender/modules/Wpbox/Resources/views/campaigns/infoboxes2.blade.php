<div class="mt-4">
    <div class="row border-radius-lg" style="background-color: #181A0F !important;">
        <div class="col-md p-3 border-right border-bottom border-text">
            <div class="h-100 d-flex flex-column justify-content-between">
                <div class="text-center mb-3">
                    @svg('clipboardlist', ['width' => '50', 'height' => '50', 'class' => 'text-primary'])
                </div>
                <div class="text-center">
                    <h2 class="text-uppercase text-secondary mb-0">{{ __('Template')}}</h2>
                    <h1 class="text-uppercase text-primary mb-0">{{ $item['template->name'] }}</h1>
                    <p class="text-muted mb-0">{{ $item['created_at'] }}</p>
                </div>
            </div>
        </div>

        <div class="col-md p-3 border-right border-bottom border-text">
            <div class="h-100 d-flex flex-column justify-content-between">
                <div class="text-center mb-3">
                    @svg('user-circle-svgrepo-com', ['width' => '50', 'height' => '50', 'class' => 'text-primary'])
                </div>
                <div class="text-center">
                    <h2 class="text-uppercase text-secondary mb-0">{{ __('Contacts Used')}}</h2>
                    <h1 class="text-uppercase text-primary mb-0">{{ $item['send_to'] }}</h1>
                    <p class="mb-0 text-muted">
                        {{ round(($item['send_to'] / $total_contacts) * 100, 2) }}% {{__('of your contacts')}}
                    </p>
                </div>
            </div>
        </div>

        <div class="col-md p-3 border-right border-bottom border-text">
            <div class="h-100 d-flex flex-column justify-content-between">
                <div class="text-center mb-3">
                    @svg('Message delivered', ['width' => '50', 'height' => '50', 'class' => 'text-primary'])
                </div>
                <div class="text-center">
                    <h2 class="text-uppercase text-secondary mb-0">{{ __('Delivered to')}}</h2>
                    <h1 class="text-uppercase text-primary mb-0">{{ round(($item['delivered_to'] / $item['send_to']) * 100, 2) }}%</h1>
                    <p class="mb-0 text-muted">
                        {{ $item['delivered_to'] }} {{ __('Contacts') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="col-md p-3 border-right border-bottom border-text">
            <div class="h-100 d-flex flex-column justify-content-between">
                <div class="text-center mb-3">
                    @svg('eye-svgrepo-com', ['width' => '50', 'height' => '50', 'class' => 'text-primary'])
                </div>
                <div class="text-center">
                    <h2 class="text-uppercase text-secondary mb-0">{{ __('Read by')}}</h2>
                    @if ($item['delivered_to'] > 0)
                    <h1 class="text-uppercase text-primary mb-0">{{ round(($item['read_by'] / $item['delivered_to']) * 100, 2) }}%</h1>
                    @else
                    <h1 class="text-uppercase text-primary mb-0">0%</h1>
                    @endif
                    <p class="mb-0 text-muted">
                        {{ $item['read_by'] }} {{ __('of the')}} {{ $item['delivered_to'] }} {{__('Contacts messaged.')}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
