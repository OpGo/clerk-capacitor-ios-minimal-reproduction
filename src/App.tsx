import "./App.css"
import { Helmet } from "react-helmet"
import { IonRouterOutlet } from "@ionic/react"
import { Redirect, Route } from "react-router"
import { IonReactRouter } from "@ionic/react-router"
import { ClerkProvider, SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Add your Clerk publishable key to the .env.local file")
}

function App() {
    return (
        <>
            <Helmet>
                <title>Example app</title>
            </Helmet>
            <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route path="/login">
                            <Helmet>
                                <title>Login - Example app</title>
                            </Helmet>
                            <div className={"flex w-full h-full justify-center items-center"}>
                                <SignIn forceRedirectUrl={"/app/login-success"} />
                            </div>
                        </Route>

                        <Route path="/app/*">
                            <>
                                <SignedIn>
                                    <AppContent />
                                </SignedIn>
                                <SignedOut>
                                    <div className={"flex w-full justify-center h-full items-center"}>
                                        <SignIn />
                                    </div>
                                </SignedOut>
                            </>
                        </Route>

                        <Route path="/not-found">Not found</Route>

                        <Redirect exact from="/" to="/login" />
                    </IonRouterOutlet>
                </IonReactRouter>
            </ClerkProvider>
        </>
    )
}

function AppContent() {
    const { user } = useUser()
    const userName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()

    return <>You are signed in as {userName}</>
}

export default App
