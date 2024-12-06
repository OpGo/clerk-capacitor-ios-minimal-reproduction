import "./App.css"
import { Helmet } from "react-helmet"
import { IonRouterOutlet, IonContent } from "@ionic/react"
import { Redirect, Route } from "react-router"
import { IonReactRouter } from "@ionic/react-router"
import { useAuth, useUser } from "@clerk/clerk-react"
import SignInForm from "./SignIn"
import SignUpForm from "./SignUp"
import { HubClerkProvider } from "./ClerkProvider"

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
            <HubClerkProvider>
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route path="/login">
                            <Helmet>
                                <title>Login - Example app</title>
                            </Helmet>
                            <IonContent>
                                <div className={"flex w-full h-full justify-center items-center"}>
                                    <SignInForm />
                                </div>
                            </IonContent>
                        </Route>

                        <Route path="/register">
                            <Helmet>
                                <title>Register - Example app</title>
                            </Helmet>
                            <IonContent>
                                <div className={"flex w-full h-full justify-center items-center"}>
                                    <SignUpForm />
                                </div>
                            </IonContent>
                        </Route>

                        <Route path="/app/*">
                            <IonContent>
                                <div className={"flex w-full h-full justify-center items-center"}>
                                    <AppContent />
                                </div>
                            </IonContent>
                        </Route>

                        <Route path="/not-found">Not found</Route>

                        <Redirect exact from="/" to="/login" />
                    </IonRouterOutlet>
                </IonReactRouter>
            </HubClerkProvider>
        </>
    )
}

function AppContent() {
    const { isLoaded, isSignedIn, userId, signOut } = useAuth()
    const { user } = useUser()

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    if (!isSignedIn) {
        return <Redirect to="/login" />
    }

    const handleSignOut = async () => {
        await signOut()
        return <Redirect to="/login" />
    }

    return (
        <div>
            <Helmet>
                <title>App - Example app</title>
            </Helmet>
            <div className="text-center mt-8">Welcome to the app</div>
            <div className="text-center mt-8">User ID: {userId}</div>
            <div className="text-center mt-8">Email: {user?.primaryEmailAddress?.emailAddress}</div>
            <div className="text-center mt-8">
                <button onClick={handleSignOut} className="signout-button">Sign Out</button>
            </div>
        </div>
    )
}

export default App
