
    <div class="card h-100" style="border-radius: 2rem;">
        <div class="card-body p-4">
            <h1 class="font-weight-bolder" style="font-size: 3rem;">
                {{ is_array($plan) ? $plan['name'] : $plan->name }}
            </h1>
            <span class="badge badge-primary text-uppercase mb-2" style="background: #A7D26D;">Standard</span>
            <h4 class="display-4 font-weight-bold card-title text-center" style="font-size: 2rem;">
                @if (is_array($plan) ? $plan['price'] == -1 : $plan->price == -1)
                    Custom Price
                @elseif (is_array($plan) ? $plan['price'] > 0 : $plan->price > 0)
                    {{ config('money')[strtoupper(config('settings.cashier_currency'))]['symbol'] }}
                    {{ is_array($plan) ? $plan['price'] : $plan->price }}
                    <span class="font-weight-normal text-muted" style="font-size: 2rem;">/mo</span>
                @endif
                
                <!-- <span class="d-block small text-center my-3" style="font-size: 1rem;">
                    Annual
                    <span class="* px-3 py-1 ml-3" style="border-radius: .9rem;background-color: #e1e1e1;">15% off</span>
                </span> -->

                @if ($switch == '1')
                    @if (is_array($plan) ? $plan['price'] == -1 : $plan->price == -1)
                        <a href="{{ Route('contactUs') }}" class="btn btn-white my-3  d-block w-100 py-3 font-weight-bolder border-0" style="background: #A7D26D;border-radius: 1.3rem;font-size: 1.3rem;">{{ __('Contact Us') }}</a>
                    @elseif (strlen($plan['stripe_id']) > 2 && config('settings.subscription_processor') == 'Stripe')
                        <form action="/plan/session" method="post">
                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                            <input type="hidden" name="plan_name" value="{{ $plan['name'] }}">
                            <input type="hidden" name="plan_price" value="{{ $plan['price'] * 100 }}">
                            <input type="hidden" name="plan_id" value="{{ $plan['id'] }}">
                            <button type="submit" class="btn btn-white my-3  d-block w-100 py-3 font-weight-bolder border-0" style="background: #A7D26D;border-radius: 1.3rem;font-size: 1.3rem;">{{ __('Choose') . ' ' . $plan['name'] }}</button>                                 
                        </form>
                    @else 
                        <a href="{{ Route('contactUs') }}" class="btn btn-white my-3  d-block w-100 py-3 font-weight-bolder border-0" style="background: #A7D26D;border-radius: 1.3rem;font-size: 1.3rem;">{{ __('Contact Us') }}</a>
                    @endif
                
                @elseif (is_array($plan) ? $plan['price'] == -1 : $plan->price == -1)
                    <a href="{{ Route('contactUs') }}" class="btn btn-white my-3  d-block w-100 py-3 font-weight-bolder border-0" style="background: #A7D26D;border-radius: 1.3rem;font-size: 1.3rem;">{{ __('Contact Us') }}</a>
                @else
                    <a class="btn btn-white d-block w-100 py-3 my-3  font-weight-bolder" role="button"
                        href="{{ route('plans.current') }}"
                        style="background: #A7D26D;border-radius: 1.3rem;font-size: 1.3rem;">Choose plan</a>
                @endif

            </h4>
            <div>
                <ul class="list-unstyled">
                    @if ($plan['features'] != null)
                        @foreach (explode(',', $plan['features']) as $feature)
                            <li class="d-flex mb-2 "><span
                                    class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon bs-icon-xs mr-2"
                                    style="background-color: #A7D26D;"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"
                                        class="bi bi-check-lg text-white">
                                        <path
                                            d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022">
                                        </path>
                                    </svg></span>

                                <span class="font-weight-bolder">{{ $feature }}</span>
                            </li>
                        @endforeach
                    @endif

                </ul>
            </div>
        </div>
    </div>

