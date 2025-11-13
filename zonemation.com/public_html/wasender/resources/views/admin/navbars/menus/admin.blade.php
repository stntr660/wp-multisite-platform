


<ul class="navbar-nav">
    <li class="nav-item">
        <a class="nav-link {{ Route::currentRouteName() == 'dashboard' ? 'active' : '' }}" href="{{ route('dashboard') }}">
        
        <img src="{{ asset('assets/img/Dashboard.svg') }}" alt="Dashboard icon" class="nav-icon" style="color: #969890; margin-left: 5px;" />
            {{ __('Dashboard') }}
        </a>
    </li>
    @if (config('settings.admin_companies_enabled', true))
        <li class="nav-item">
            <a class="nav-link {{ Route::currentRouteName() == 'admin.companies.index' ? 'active' : '' }}" href="{{ route('admin.companies.index') }}">
                
                <img src="{{ asset('assets/img/Companies.svg') }}"  alt="Companies icon" class="nav-icon" style="color: #969890; margin-left: 5px;" />
                {{ __('Companies') }}
            </a>
        </li>
    @endif
    @include('admin.navbars.menus.extra')

    <li class="nav-item">
        <a class="nav-link {{ Route::currentRouteName() == 'admin.landing' ? 'active' : '' }}" href="{{ route('admin.landing') }}">
            
        <img src="{{ asset('assets/img/LandingPage.svg') }}" alt="Landing Page icon" class="nav-icon" style="color: #969890; margin-left: 5px;" />
            {{ __('Landing Page') }}
        </a>
    </li>
    @if (config('settings.pricing_enabled', true))
        <li class="nav-item">
            <a class="nav-link {{ Route::currentRouteName() == 'plans.index' ? 'active' : '' }}" href="{{ route('plans.index') }}">
                
            <img src="{{ asset('assets/img/PricingPlans.svg') }}"  alt="Pricing Plans icon" class="nav-icon" style="color: #969890; margin-left: 5px;" />
                {{ __('Pricing plans') }}
            </a>
        </li>
    @endif

    <li class="nav-item">
        <a class="nav-link" target="_blank" href="{{ url('/tools/languages')."/".strtolower(config('settings.app_locale', 'en'))."/translations" }}">
            
        <img src="{{ asset('assets/img/Translations.svg') }}"  alt="Translations icon" class="nav-icon" style="color: #969890; margin-left: 5px;" />
            {{ __('Translations') }}
        </a>
    </li>
    @if (!config('settings.hideApps', false))
        <li class="nav-item">
            <a class="nav-link {{ Route::currentRouteName() == 'admin.apps.index' ? 'active' : '' }}" href="{{ route('admin.apps.index') }}">
                
            <img src="{{ asset('assets/img/Apps.svg') }}"  alt="Apps icon" class="nav-icon" style="color: #969890; margin-left: 5px;" />
                {{ __('Apps') }}
            </a>
        </li>
    @endif

    <li class="nav-item">
        <a class="nav-link {{ Route::currentRouteName() == 'admin.settings.index' ? 'active' : '' }}" href="{{ route('admin.settings.index') }}">
            
        <img src="{{ asset('assets/img/SiteSettings.svg') }}" alt="Site Settings icon" class="nav-icon" style="color: #969890 !important; margin-left: 5px;" />
            {{ __('Site Settings') }}
        </a>
    </li>
</ul>
