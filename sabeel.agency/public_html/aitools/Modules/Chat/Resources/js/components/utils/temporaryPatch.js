export function imgTempPatch(arg) {
    return {
        isTemp: true,
        id: Date.now().toString(),
        user: "Agatha Williams", // name will get from user data
        originalName: "",
        imageUrl: "",
        name: arg.promt,
        slug: "",
        size: arg.resulation,
        artStyle: arg.artStyle,
        lightingStyle: arg.lightingStyle,
        created_at: new Date().toISOString(),
    };
}
