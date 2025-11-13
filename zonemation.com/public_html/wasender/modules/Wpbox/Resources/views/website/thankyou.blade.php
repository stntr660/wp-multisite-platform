@extends('wpbox::website.layout')

@section('content')
<main class="my-5 ">
    <section class="" style="margin-bottom: 9rem;">
        <div class="container">
            <div class="row d-xl-flex justify-content-xl-center align-items-xl-center">
                <div class="col-12 text-center">
                    <h1>Thank You</h1>
                    <h3>For Contacting Us</h3>
                    <p class="text-muted">We appreciate your message and will get back to you shortly.</p>
                    <a class="btn p-2 text-dark" style="background: #A7D26D; border-radius: .5rem; font-size: .8rem;" role="button" href="{{ route('homepage') }}">Back to Home</a>
                </div>
            </div>
        </div>
    </section>
</main>
@endsection

