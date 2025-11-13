@extends('wpbox::website.layout')

@section('content')
<main class="mb-5">
        <section class="mt-5">
            <div class="container">
                <div class="row d-xl-flex justify-content-xl-center align-items-xl-center">
                    <div class="col-md-6">
                        <div>
                            <h1>Everything you need to grow</h1>
                            <h1 style="background: #A7D26D;">your business on WhatsApp</h1>
                            <div>
                                <ul class="list-group mt-3">
                                    <li class="list-unstyled  border-0 p-0"><img class="mr-2" src="assets/img/Fichier%2074.svg" width="22" height="19">Targeted Campaigns to deliver personalized offers</li>
                                    <li class="list-unstyled  border-0 p-0"><img class="mr-2" src="assets/img/Fichier%2074.svg" width="22" height="19">Pre-built templates to send updates &amp; reminders</li>
                                    <li class="list-unstyled  border-0 p-0"><img class="mr-2" src="assets/img/Fichier%2074.svg" width="22" height="19">24×7 instant engagement with no-code chatbots</li>
                                </ul>
                            </div>
                        </div>
                        <div class="w-100 text-center mt-4"></div>
                    </div>
                    <div class="col-md-6 p-0">
                        <section class="position-relative">
                            <div class="container position-relative">
                                <div class="row d-flex justify-content-center p-0">
                                    <div class="col col-12">
                                        <div class="card" style="border: 1px solid black;border-image: linear-gradient(to bottom, rgba(108,219,141,0) 25%,black 25%,rgb(167,210,109,1) 75%,rgba(108,220,141,0) 75%);border-image-slice: 1;border-right: none;">
                                            <div class="card-body text-center p-sm-5">
                                                <div method="post">
                                                    <div class="mb-3"><input class="form-control" type="text" id="name-2" name="name" placeholder="Full name"></div>
                                                    <div class="mb-3"><input class="form-control" type="email" id="email-2" name="email" placeholder="Email"></div>
                                                    <div class="mb-3"><input class="form-control" type="email" id="email-1" name="email" placeholder="Phone number"></div>
                                                    <div class="mb-3"><input class="form-control" type="text" id="name-1" name="bsmodel" placeholder="Business model"></div>
                                                    <div>
                                                        <a class="btn btn-primary w-100 border-0" role="button" href="{{ route('thankyou') }}" style="border-radius: 12px; background: #A7D26D;">Send</a>
                                                    </div>
                                                </div>
                                                <div class="pt-2"><img><img><img></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    </main>
@endsection