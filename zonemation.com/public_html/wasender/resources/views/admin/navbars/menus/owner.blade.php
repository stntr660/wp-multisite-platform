



<ul class="navbar-nav">
    <li class="nav-item">
        <a class="nav-link @if (Route::currentRouteName() == 'dashboard') active @endif" href="{{ route('dashboard') }}">
            <img class="nav-icon" style="width: 20px !important;height: auto  !important;" class="nav-icon" style="width: 20px !important;height: auto  !important;" src="{{ asset('assets/img/Dashboard.svg' ) }}" alt="Dashboard Icon"> {{ __('Dashboard') }}
        </a>
    </li>

    @include('admin.navbars.menus.extra')

    @if (!config('settings.hide_company_profile', false))
        <li class="nav-item">
            <a class="nav-link @if (Route::currentRouteName() == 'admin.companies.edit') active @endif" href="{{ route('admin.companies.edit', auth()->user()->company->id) }}">
            <img src="{{ asset('assets/img/Company.svg') }}" class="nav-icon" style="width: 20px !important;height: auto  !important;"  alt="Company Icon"> {{ __('Company') }}
            </a>
        </li>
    @endif

    @if (!config('settings.hide_company_apps', false))
        <li id=apps class="nav-item ">
            <a class="nav-link @if (Route::currentRouteName() == 'admin.apps.company') active @endif" href="{{ route('admin.apps.company') }}">
            <img src="{{ asset('assets/img/Apps.svg') }}" class="nav-icon" style="width: 20px !important;height: auto  !important;" alt="Apps Icon"> {{ __('Apps') }}
            </a>
        </li>
    @endif

    @if(config('settings.enable_pricing'))
        <li class="nav-item">
            <a class="nav-link" href="{{ route('plans.current') }}">
            <img src="{{ asset('assets/img/Plan.svg') }}" class="nav-icon" style="width: 20px !important;height: auto  !important;"  alt="Plan Icon"> {{ __('Plan') }}
            </a>
        </li>
    @endif

    @if (!config('settings.hide_share_link', false))
        <li class="nav-item">
            <a class="nav-link" href="{{ route('admin.share') }}">
            <img src="{{ asset('assets/img/Share.svg') }}" class="nav-icon" style="width: 20px !important;height: auto  !important;" alt="Share Icon"> {{ __('Share') }}
            </a>
        </li>
    @endif
</ul>

@if (config('vendorlinks.enable', false))
    <hr class="my-3">
    <h6 class="navbar-heading p-0 text-muted">
        <span class="docs-normal">{{ __(config('vendorlinks.name', "")) }}</span>
    </h6>
    <ul class="navbar-nav mb-md-3">
        @if (strlen(config('vendorlinks.link1link', "")) > 4)
            <li class="nav-item">
                <a class="nav-link" href="{{ config('vendorlinks.link1link', "") }}" target="_blank">
                <img src="{{ asset('assets/img/Backtoyouraccount.svg') }}" class="nav-icon" style="width: 20px !important;height: auto  !important;" src="{{ asset('assets/img/' . config('vendorlinks.link1name', '')) }}" alt="Link1 Icon">
                    <span class="nav-link-text">{{ __(config('vendorlinks.link1name', "")) }}</span>
                </a>
            </li>
        @endif

        @if (strlen(config('vendorlinks.link2link', "")) > 4)
            <li class="nav-item">
                <a class="nav-link" href="{{ config('vendorlinks.link2link', "") }}" target="_blank">
                    <img class="nav-icon" style="width: 20px !important;height: auto  !important;" src="{{ asset('assets/img/' . config('vendorlinks.link2name', '')) }}" alt="Link2 Icon">
                    <span class="nav-link-text">{{ __(config('vendorlinks.link2name', "")) }}</span>
                </a>
            </li>
        @endif

        @if (strlen(config('vendorlinks.link3link', "")) > 4)
            <li class="nav-item">
                <a class="nav-link" href="{{ config('vendorlinks.link3link', "") }}" target="_blank">
                    <img class="nav-icon" style="width: 20px !important;height: auto  !important;" src="{{ asset('assets/img/' . config('vendorlinks.link3name', '')) }}" alt="Link3 Icon">
                    <span class="nav-link-text">{{ __(config('vendorlinks.link3name', "")) }}</span>
                </a>
            </li>
        @endif
    </ul>
@endif
