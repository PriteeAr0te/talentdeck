   <>
      <ToastContainer position="top-right" transition={Slide} className="z-50" autoClose={6000} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto p-6 bg-white dark:bg-[#0A0011] rounded-xl space-y-10"
      >
        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Basic Information</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Let us know who you are and what you do.</p>
            </div>
            <div className="space-y-4">
              <InputComponent
                label="Username"
                id="username"
                registration={register("username")}
                error={errors.username?.message}
              />
              <InputComponent
                label="Headline"
                id="headline"
                registration={register("headline")}
                error={errors.headline?.message}
              />
              <TextareaComponent
                label="Bio"
                id="bio"
                registration={register("bio")}
                error={errors.bio?.message}
                rows={5}
                placeholder="Tell us about yourself"
              />
              <DropdownComponent<Partial<CreateProfileSchema>>
                name="category"
                label="Category"
                setValue={setValue}
                watch={watch}
                options={CATEGORY_OPTIONS}
                error={errors.category?.message}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Skills & Location</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Highlight your strongest areas and where you&apos;re based.</p>
            </div>
            <div className="space-y-4">
              <SkillsSelector<Partial<CreateProfileSchema>>
                control={control}
                name="skills"
                error={errors.skills?.message}
                setValue={setValue}
                watch={watch}
              />
              <AddressSelector register={register} errors={errors} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Profile Preferences</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Control visibility and availability.</p>
            </div>
            <div className="flex gap-6 items-center">
              <CheckboxField
                label="Available for Work"
                checked={watch("availableforwork") ?? false}
                onChange={(val) => setValue("availableforwork", val)}
              />
              <CheckboxField
                label="Public Profile"
                checked={watch("isVisible") ?? true}
                onChange={(val) => setValue("isVisible", val)}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Profile Image</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Upload a clear and professional profile picture.</p>
            </div>
            <div>
              <ProfilePhotoUpload
                value={profilePicFile}
                onChange={(file) => setProfilePicFile(file)}
                existingImageUrl={existingProfilePictureUrl}
                error={errors.profilePicture?.message}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Project Images</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Showcase your best work.</p>
            </div>
            <div>
              <ImageUploadComponent
                value={projectImagesFiles}
                onChange={setProjectImagesFiles}
                existingImageUrls={existingProjectImageUrls}
                error={uploadError}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Social Links</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Help people connect with you across platforms.</p>
            </div>
            <div>
              <DynamicLinksComponent<UpdateProfileSchema, "socialLinks">
                name="socialLinks"
                label="Social Links"
                register={register}
                errors={errors}
                fields={socialFields}
                append={appendSocial}
                remove={removeSocial}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Portfolio Links</h2>
              <p className="text-sm darl:text-gray-400 text-gray-500 mt-1">Share your portfolio or relevant links.</p>
            </div>
            <div>
              <DynamicLinksComponent<UpdateProfileSchema, "portfolioLinks">
                name="portfolioLinks"
                label="Portfolio Links"
                register={register}
                errors={errors}
                fields={portfolioFields}
                append={appendPortfolio}
                remove={removePortfolio}
              />
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end border-t dark:border-t-gray-200 border-t-gray-800">
          <button
            type="submit"
            className="mt-6 px-6 bg-primary text-white py-2 w-fit rounded-lg hover:bg-primary-dark cursor-pointer hover:bg-secondary focus:outline-none focus:border-0"
          >
            Update Profile
          </button>
        </div>
      </form>
    </>